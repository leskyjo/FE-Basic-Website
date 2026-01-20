/**
 * JSearch API Client
 *
 * Wrapper for JSearch API (via RapidAPI)
 * Documentation: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
 *
 * Free Tier Limits: 200 API calls/month
 */

// ============================================================================
// TYPES
// ============================================================================

export interface JSearchJobLocation {
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  street?: string;
  latitude?: number;
  longitude?: number;
}

export interface JSearchJob {
  job_id: string;
  job_title: string;
  employer_name: string;
  employer_logo?: string;
  employer_website?: string;
  job_publisher: string;
  job_employment_type?: string; // FULLTIME, PARTTIME, CONTRACTOR, INTERN
  job_description: string;
  job_apply_link: string;
  job_posted_at_datetime_utc?: string;
  job_city?: string;
  job_state?: string;
  job_country?: string;
  job_latitude?: number;
  job_longitude?: number;
  job_is_remote?: boolean;
  job_salary_min?: number;
  job_salary_max?: number;
  job_salary_currency?: string;
  job_required_experience?: {
    no_experience_required?: boolean;
    required_experience_in_months?: number;
    experience_mentioned?: boolean;
    experience_preferred?: boolean;
  };
  job_required_skills?: string[];
  job_required_education?: {
    postgraduate_degree?: boolean;
    professional_school?: boolean;
    high_school?: boolean;
    associates_degree?: boolean;
    bachelors_degree?: boolean;
    degree_mentioned?: boolean;
    degree_preferred?: boolean;
    professional_school_mentioned?: boolean;
  };
  job_highlights?: {
    Qualifications?: string[];
    Responsibilities?: string[];
    Benefits?: string[];
  };
}

export interface JSearchResponse {
  status: string;
  request_id: string;
  data: JSearchJob[];
}

export interface JobSearchParams {
  query: string;
  location?: string;
  radius?: number; // km
  page?: number;
  num_pages?: string;
  date_posted?: "all" | "today" | "3days" | "week" | "month";
  remote_jobs_only?: boolean;
  employment_types?: string; // FULLTIME,PARTTIME,CONTRACTOR,INTERN
}

export interface JSearchError {
  message: string;
  status?: number;
}

// ============================================================================
// CLIENT CLASS
// ============================================================================

export class JSearchClient {
  private apiKey: string;
  private apiHost: string;
  private baseUrl: string;

  constructor(apiKey?: string, apiHost?: string) {
    this.apiKey = apiKey || process.env.JSEARCH_API_KEY || "";
    this.apiHost = apiHost || process.env.JSEARCH_API_HOST || "jsearch.p.rapidapi.com";
    this.baseUrl = `https://${this.apiHost}`;

    if (!this.apiKey) {
      throw new Error("JSearch API key is required");
    }
  }

  /**
   * Search for jobs
   *
   * @param params - Search parameters (query, location, filters)
   * @returns Job search results
   */
  async searchJobs(params: JobSearchParams): Promise<JSearchResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("query", params.query);

    if (params.location) {
      queryParams.append("location", params.location);
    }
    if (params.radius) {
      queryParams.append("radius", params.radius.toString());
    }
    if (params.page) {
      queryParams.append("page", params.page.toString());
    }
    if (params.num_pages) {
      queryParams.append("num_pages", params.num_pages);
    }
    if (params.date_posted) {
      queryParams.append("date_posted", params.date_posted);
    }
    if (params.remote_jobs_only !== undefined) {
      queryParams.append("remote_jobs_only", params.remote_jobs_only.toString());
    }
    if (params.employment_types) {
      queryParams.append("employment_types", params.employment_types);
    }

    const url = `${this.baseUrl}/search?${queryParams.toString()}`;

    return this.makeRequest<JSearchResponse>(url);
  }

  /**
   * Get job details by ID
   *
   * @param jobId - JSearch job ID
   * @param country - Country code (default: us)
   * @returns Job details
   */
  async getJobDetails(jobId: string, country: string = "us"): Promise<JSearchResponse> {
    const url = `${this.baseUrl}/job-details?job_id=${encodeURIComponent(jobId)}&country=${country}`;

    return this.makeRequest<JSearchResponse>(url);
  }

  /**
   * Search for jobs with filters (convenience method)
   *
   * @param query - Job search query (e.g., "software engineer")
   * @param location - Location (e.g., "San Francisco, CA")
   * @param filters - Additional filters
   * @returns Job search results
   */
  async search(
    query: string,
    location?: string,
    filters?: {
      radius?: number;
      remote_only?: boolean;
      employment_types?: string[];
      date_posted?: "all" | "today" | "3days" | "week" | "month";
    }
  ): Promise<JSearchResponse> {
    const params: JobSearchParams = {
      query,
      location,
      radius: filters?.radius,
      remote_jobs_only: filters?.remote_only,
      employment_types: filters?.employment_types?.join(","),
      date_posted: filters?.date_posted,
      page: 1,
      num_pages: "5", // Fetch 5 pages (~50 jobs) for better selection
    };

    return this.searchJobs(params);
  }

  /**
   * Make HTTP request to JSearch API
   *
   * @param url - Full API URL
   * @returns Parsed response
   */
  private async makeRequest<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "x-rapidapi-host": this.apiHost,
          "x-rapidapi-key": this.apiKey,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`JSearch API error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      return data as T;

    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while calling JSearch API");
    }
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Create a new JSearch client instance
 *
 * Uses environment variables JSEARCH_API_KEY and JSEARCH_API_HOST
 */
export function createJSearchClient(): JSearchClient {
  return new JSearchClient();
}

/**
 * Transform JSearch job to our internal job format
 *
 * @param jsearchJob - Raw JSearch job data
 * @returns Formatted job data for our database
 */
export function transformJSearchJob(jsearchJob: JSearchJob) {
  return {
    external_id: jsearchJob.job_id,
    title: jsearchJob.job_title,
    company: jsearchJob.employer_name,
    description: jsearchJob.job_description,
    location: {
      city: jsearchJob.job_city,
      state: jsearchJob.job_state,
      country: jsearchJob.job_country,
      coordinates: jsearchJob.job_latitude && jsearchJob.job_longitude
        ? { lat: jsearchJob.job_latitude, lng: jsearchJob.job_longitude }
        : null,
      formatted_address: [jsearchJob.job_city, jsearchJob.job_state, jsearchJob.job_country]
        .filter(Boolean)
        .join(", "),
    },
    salary_min: jsearchJob.job_salary_min,
    salary_max: jsearchJob.job_salary_max,
    salary_currency: jsearchJob.job_salary_currency || "USD",
    job_type: jsearchJob.job_employment_type?.toLowerCase() || null,
    experience_level: determineExperienceLevel(jsearchJob.job_required_experience?.required_experience_in_months),
    requirements: {
      degree: jsearchJob.job_required_education?.bachelors_degree ||
              jsearchJob.job_required_education?.associates_degree ||
              false,
      experience_years: jsearchJob.job_required_experience?.required_experience_in_months
        ? Math.floor(jsearchJob.job_required_experience.required_experience_in_months / 12)
        : 0,
      skills: jsearchJob.job_required_skills || [],
      certifications: [],
    },
    tags: extractTags(jsearchJob),
    apply_url: jsearchJob.job_apply_link,
    posted_at: jsearchJob.job_posted_at_datetime_utc
      ? new Date(jsearchJob.job_posted_at_datetime_utc).toISOString()
      : new Date().toISOString(),
    expires_at: null,
    source: "jsearch",
    is_active: true,
  };
}

/**
 * Determine experience level from months of experience
 */
function determineExperienceLevel(months?: number): string {
  if (!months || months === 0) return "entry";
  const years = months / 12;
  if (years < 2) return "entry";
  if (years < 5) return "mid";
  if (years < 10) return "senior";
  return "executive";
}

/**
 * Extract relevant tags from job data
 */
function extractTags(job: JSearchJob): string[] {
  const tags: string[] = [];

  if (job.job_is_remote) tags.push("remote");
  if (job.job_employment_type) tags.push(job.job_employment_type.toLowerCase());
  if (job.job_required_experience?.no_experience_required) tags.push("no-experience");

  return tags;
}
