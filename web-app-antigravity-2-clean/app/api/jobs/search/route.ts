import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createJSearchClient, transformJSearchJob } from "@/lib/jobs/jsearch-client";
import type { JSearchJob } from "@/lib/jobs/jsearch-client";
import { getJobsTierLimits } from "@/lib/tier/jobs-tier-limits";
import { parseLocationToCoordinates } from "@/lib/geo/zip-coordinates";

/**
 * POST /api/jobs/search
 *
 * Fast job search WITHOUT AI matching (AI moved to saved jobs/resume generation)
 *
 * Flow:
 * 1. Authenticate user & check tier limits
 * 2. Get user's location and preferences
 * 3. Search jobs via JSearch API with proper location formatting
 * 4. Post-filter by distance to ensure accuracy
 * 5. Sort by date/distance/relevance
 * 6. Add "recommended" tags based on simple keyword matching
 * 7. Cache jobs in database
 * 8. Return results (NO AI, fast and cheap)
 *
 * Performance: ~2-3 seconds (vs 15-20 with AI)
 * Cost: ~$0.02 per search (vs $0.50 with AI)
 */
export async function POST(request: Request) {
  const startTime = Date.now();
  console.log("[Job Search] ========== POST request received ==========");

  try {
    const supabase = createClient();

    // 1. AUTHENTICATE
    const { data: userData, error: authError } = await supabase.auth.getUser();

    if (authError || !userData.user) {
      console.error("[Job Search] Auth error:", authError);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = userData.user.id;
    console.log("[Job Search] User ID:", userId);

    // 2. GET USER TIER AND CHECK LIMITS
    const { data: profile } = await supabase
      .from("profiles")
      .select("tier, zip_code, city, state")
      .eq("user_id", userId)
      .single();

    const userTier = profile?.tier || "starter";
    const tierLimits = getJobsTierLimits(userTier);

    console.log("[Job Search] User tier:", userTier);
    console.log("[Job Search] Results limit:", tierLimits.results_per_search);

    // TODO: Check daily search limit (requires usage tracking table)
    // For now, just enforce result limits

    // 3. PARSE REQUEST BODY
    const body = await request.json();
    const {
      query,
      location,
      radius = 50, // Default 50 miles
      remote_only = false,
      employment_types,
      date_posted = "month",
      experience_level,
      salary_min,
    } = body;

    if (!query || !query.trim()) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    console.log("[Job Search] Query:", query);
    console.log("[Job Search] Location:", location);
    console.log("[Job Search] Radius:", radius, "miles");
    console.log("[Job Search] Filters:", { remote_only, employment_types, date_posted, experience_level, salary_min });

    // 4. DETERMINE SEARCH LOCATION
    let searchLocation = location;
    let userCoordinates: { lat: number; lng: number } | null = null;

    // If no location provided, use user's saved location
    if (!searchLocation && profile?.city && profile?.state) {
      searchLocation = `${profile.city}, ${profile.state}`;
      console.log("[Job Search] Using saved location:", searchLocation);
    } else if (!searchLocation && profile?.zip_code) {
      searchLocation = profile.zip_code;
      console.log("[Job Search] Using saved ZIP:", searchLocation);
    }

    // Get user coordinates for distance calculation (if we have city/state or ZIP)
    if (searchLocation) {
      userCoordinates = parseLocationToCoordinates(searchLocation);
      console.log("[Job Search] User coordinates:", userCoordinates);
      if (!userCoordinates) {
        console.warn("[Job Search] Could not parse location to coordinates:", searchLocation);
      }
    }

    // 5. GET USER PROFILE DATA FOR KEYWORD MATCHING
    const { data: jobsProfile } = await supabase
      .from("user_jobs_profiles")
      .select("skills_to_highlight, recommended_job_types")
      .eq("user_id", userId)
      .maybeSingle();

    const { data: userSkills } = await supabase
      .from("user_skills")
      .select("skills_raw, skills_normalized")
      .eq("user_id", userId)
      .maybeSingle();

    // Combine all user skills for keyword matching
    const userKeywords = [
      ...(jobsProfile?.skills_to_highlight || []),
      ...(jobsProfile?.recommended_job_types || []),
      ...(userSkills?.skills_normalized || []),
      ...(userSkills?.skills_raw || []),
    ].map(k => k.toLowerCase());

    console.log("[Job Search] User keywords for matching:", userKeywords.length);

    // 6. BUILD JSEARCH QUERY (combine job title + location into ONE string)
    // JSearch expects: "plumber in new port richey florida" NOT separate fields
    let jsearchQuery = query;
    if (searchLocation) {
      jsearchQuery = `${query} in ${searchLocation}`;
    }

    // Convert radius from miles to kilometers (JSearch requires km as number)
    const radiusKm = Math.round(radius * 1.60934);

    console.log("[Job Search] JSearch query:", jsearchQuery);
    console.log("[Job Search] JSearch radius:", radiusKm, "km (", radius, "miles)");

    // 7. SEARCH JOBS VIA JSEARCH API
    console.log("[Job Search] Calling JSearch API...");
    const jsearchClient = createJSearchClient();

    const jsearchResults = await jsearchClient.search(
      jsearchQuery,  // Combined: "plumber in new port richey florida"
      undefined,     // NO separate location parameter (deprecated)
      {
        radius: radiusKm,  // Kilometers as number
        remote_only,
        employment_types: employment_types ? employment_types.split(',') : undefined,
        date_posted,
      }
    );

    const jobs = jsearchResults.data || [];
    console.log("[Job Search] JSearch returned", jobs.length, "jobs");

    // DEBUG: Log first 3 job locations to diagnose location filtering
    if (jobs.length > 0) {
      console.log("[Job Search] Sample job locations:");
      jobs.slice(0, 3).forEach((job, idx) => {
        console.log(`  ${idx + 1}. ${job.job_title} - ${job.job_city}, ${job.job_state} (${job.job_latitude}, ${job.job_longitude})`);
      });
    }

    if (jobs.length === 0) {
      return NextResponse.json({
        results: [],
        message: "No jobs found matching your search criteria. Try expanding your radius or adjusting filters.",
        query_info: { query, location: searchLocation, radius },
      });
    }

    // 8. POST-FILTER BY DISTANCE (optional validation only)
    // JSearch handles location filtering via the query, we only validate distance if we have coords
    let filteredJobs = jobs;

    // Distance validation (only if we have user coordinates)
    if (userCoordinates && !remote_only && filteredJobs.length > 0) {
      const beforeCount = filteredJobs.length;

      filteredJobs = filteredJobs.filter(job => {
        if (job.job_is_remote) return true; // Always include remote jobs

        if (job.job_latitude && job.job_longitude) {
          const distance = calculateDistance(
            userCoordinates.lat,
            userCoordinates.lng,
            job.job_latitude,
            job.job_longitude
          );

          // Validate job is within specified radius
          const withinRadius = distance <= radius;
          if (!withinRadius) {
            console.log(`  [FILTERED OUT] ${job.job_title} - ${distance.toFixed(1)}mi away (radius: ${radius}mi)`);
          }
          return withinRadius;
        }

        // If no coordinates, trust JSearch's location filtering
        return true;
      });

      console.log(`[Job Search] Distance validation: ${beforeCount} → ${filteredJobs.length} jobs (within ${radius} miles)`);
    } else {
      console.log("[Job Search] Skipping distance filter - trusting JSearch location results");
    }

    // 9. CALCULATE DISTANCE AND ADD KEYWORD MATCHING
    const enrichedJobs = filteredJobs.map(job => {
      // Calculate distance from user
      let distance: number | null = null;
      if (userCoordinates && job.job_latitude && job.job_longitude) {
        distance = calculateDistance(
          userCoordinates.lat,
          userCoordinates.lng,
          job.job_latitude,
          job.job_longitude
        );
      }

      // Simple keyword matching for "recommended" tag
      const jobText = `${job.job_title} ${job.job_description} ${(job.job_required_skills || []).join(' ')}`.toLowerCase();
      const matchedKeywords = userKeywords.filter(keyword => jobText.includes(keyword));
      const isRecommended = matchedKeywords.length >= 2; // Match at least 2 keywords

      return {
        ...job,
        distance_miles: distance ? Math.round(distance) : null,
        is_recommended: isRecommended,
        matched_keywords: matchedKeywords.slice(0, 5), // Top 5 matched keywords
      };
    });

    // 10. SORT RESULTS
    // Primary: Recommended jobs first
    // Secondary: Distance (closest first)
    // Tertiary: Date posted (newest first)
    enrichedJobs.sort((a, b) => {
      // Recommended first
      if (a.is_recommended && !b.is_recommended) return -1;
      if (!a.is_recommended && b.is_recommended) return 1;

      // Then by distance (if available)
      if (a.distance_miles !== null && b.distance_miles !== null) {
        if (a.distance_miles !== b.distance_miles) {
          return a.distance_miles - b.distance_miles;
        }
      }

      // Then by date (newest first)
      const dateA = a.job_posted_at_datetime_utc ? new Date(a.job_posted_at_datetime_utc).getTime() : 0;
      const dateB = b.job_posted_at_datetime_utc ? new Date(b.job_posted_at_datetime_utc).getTime() : 0;
      return dateB - dateA;
    });

    // 11. ENFORCE TIER RESULT LIMIT
    const limitedJobs = enrichedJobs.slice(0, tierLimits.results_per_search);

    console.log("[Job Search] Returning", limitedJobs.length, "jobs (tier limit:", tierLimits.results_per_search, ")");

    // 12. TRANSFORM TO FRONTEND FORMAT
    const results = limitedJobs.map(job => ({
      job_id: job.job_id,
      title: job.job_title,
      company: job.employer_name,
      location: job.job_is_remote
        ? "Remote"
        : [job.job_city, job.job_state].filter(Boolean).join(", ") || "Location not specified",
      description: job.job_description,
      apply_url: job.job_apply_link,
      salary_min: job.job_salary_min,
      salary_max: job.job_salary_max,
      salary_currency: job.job_salary_currency,
      job_type: job.job_employment_type?.toLowerCase().replace('_', ' ') || null,
      experience_required: job.job_required_experience?.required_experience_in_months
        ? `${Math.floor(job.job_required_experience.required_experience_in_months / 12)} years`
        : null,
      posted_at: job.job_posted_at_datetime_utc,
      is_remote: job.job_is_remote || false,
      distance_miles: job.distance_miles,
      is_recommended: job.is_recommended,
      matched_keywords: job.matched_keywords || [],
      company_logo: job.employer_logo,
    }));

    // 13. CACHE JOBS IN DATABASE (async, don't wait)
    cacheJobsInDatabase(supabase, limitedJobs).catch(err => {
      console.error("[Job Search] Failed to cache jobs:", err);
    });

    const duration = Date.now() - startTime;
    console.log(`[Job Search] ========== Request complete (${duration}ms) ==========`);

    return NextResponse.json({
      results,
      total: results.length,
      total_available: enrichedJobs.length,
      tier_limit_reached: enrichedJobs.length > tierLimits.results_per_search,
      upgrade_message: enrichedJobs.length > tierLimits.results_per_search
        ? `Upgrade to see all ${enrichedJobs.length} results`
        : null,
      query_info: {
        query,
        location: searchLocation,
        radius,
        user_tier: userTier,
        filters_applied: {
          remote_only,
          employment_types,
          date_posted,
        },
      },
    });

  } catch (error) {
    console.error("[Job Search] Error:", error);
    return NextResponse.json(
      {
        error: "Job search failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Removed: getCoordinatesFromLocation (replaced with parseLocationToCoordinates from zip-coordinates.ts)

/**
 * Calculate distance between two coordinates (Haversine formula)
 * Returns distance in miles
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Cache jobs in database for future reference (saved jobs, applications)
 */
async function cacheJobsInDatabase(supabase: any, jobs: any[]): Promise<void> {
  for (const job of jobs) {
    const transformedJob = transformJSearchJob(job);

    // Upsert job (insert if new, update if exists)
    await supabase
      .from("jobs")
      .upsert(
        {
          ...transformedJob,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "external_id",
          ignoreDuplicates: false,
        }
      );
  }

  console.log("[Job Search] Cached", jobs.length, "jobs in database");
}
