"use client";

import { useState, useEffect } from "react";
import {
  Briefcase,
  Search,
  MapPin,
  Zap,
  Building2,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  Star,
  TrendingUp,
  Sparkles,
  Target,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface JobsClientProps {
  hasLifePlan: boolean;
  hasDetailedSkills: boolean;
  initialQuery: string;
  initialCity: string;
  initialState: string;
  initialZip: string;
  userName: string;
  userTier: string;
}

interface JobResult {
  job_id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  apply_url: string;
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  job_type?: string;
  experience_required?: string;
  posted_at?: string;
  is_remote: boolean;
  distance_miles: number | null;
  is_recommended: boolean;
  matched_keywords: string[];
  company_logo?: string;
}

export function JobsClient({
  hasLifePlan,
  hasDetailedSkills,
  initialQuery,
  initialCity,
  initialState,
  initialZip,
  userName,
  userTier,
}: JobsClientProps) {
  const [query, setQuery] = useState(initialQuery);
  const [city, setCity] = useState(initialCity);
  const [state, setState] = useState(initialState);
  const [zip, setZip] = useState(initialZip);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [radius, setRadius] = useState(50); // Default 50 miles
  const [results, setResults] = useState<JobResult[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [tierLimitReached, setTierLimitReached] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState<string | null>(null);

  const JOBS_PER_PAGE = 10;

  // Persist search results in sessionStorage (cleared on logout)
  useEffect(() => {
    const savedResults = sessionStorage.getItem("job_search_results");
    const savedQuery = sessionStorage.getItem("job_search_query");
    const savedCity = sessionStorage.getItem("job_search_city");
    const savedState = sessionStorage.getItem("job_search_state");

    if (savedResults) {
      setResults(JSON.parse(savedResults));
      setHasSearched(true);
    }
    if (savedQuery) setQuery(savedQuery);
    if (savedCity) setCity(savedCity);
    if (savedState) setState(savedState);
  }, []);

  // Save results to sessionStorage whenever they change
  useEffect(() => {
    if (results.length > 0) {
      sessionStorage.setItem("job_search_results", JSON.stringify(results));
      sessionStorage.setItem("job_search_query", query);
      sessionStorage.setItem("job_search_city", city);
      sessionStorage.setItem("job_search_state", state);
    }
  }, [results, query, city, state]);

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Please enter a job title or keyword");
      return;
    }

    setIsSearching(true);
    setError("");
    setHasSearched(true);
    setCurrentPage(1); // Reset to first page on new search

    // Build location string from city + state
    let locationString = "";
    if (city && state) {
      locationString = `${city}, ${state}`;
    } else if (zip) {
      locationString = zip;
    } else if (city) {
      locationString = city;
    } else if (state) {
      locationString = state;
    }

    try {
      const response = await fetch("/api/jobs/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: query.trim(),
          location: locationString || undefined,
          radius,
          remote_only: remoteOnly,
          date_posted: "month",
        }),
      });

      if (!response.ok) {
        throw new Error("Job search failed");
      }

      const data = await response.json();
      setResults(data.results || []);
      setTierLimitReached(data.tier_limit_reached || false);
      setUpgradeMessage(data.upgrade_message || null);

    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search jobs. Please try again.");
      setResults([]);
      setTierLimitReached(false);
      setUpgradeMessage(null);
    } finally {
      setIsSearching(false);
    }
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return null;
    if (min && max) return `$${(min / 1000).toFixed(0)}K - $${(max / 1000).toFixed(0)}K`;
    if (min) return `$${(min / 1000).toFixed(0)}K+`;
    return `Up to $${(max! / 1000).toFixed(0)}K`;
  };

  const formatDistance = (miles: number | null) => {
    if (miles === null) return null;
    if (miles < 1) return "< 1 mi";
    return `${miles} mi`;
  };

  // Pagination logic
  const totalPages = Math.ceil(results.length / JOBS_PER_PAGE);
  const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
  const endIndex = startIndex + JOBS_PER_PAGE;
  const paginatedResults = results.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6 w-full overflow-x-hidden">
      {/* Header Section - Technical Dashboard Style */}
      <div className="relative glass-strong border-2 border-cyber-red/40 overflow-hidden w-full"
           style={{
             clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)"
           }}>
        {/* Animated scan line effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyber-red/5 via-transparent to-transparent animate-pulse opacity-30" />

        {/* Corner accent cuts */}
        <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-cyber-red/60"
             style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }} />
        <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-cyber-red/60"
             style={{ clipPath: "polygon(0 100%, 100% 100%, 0 0)" }} />

        {/* Main Logo */}
        <div className="relative flex items-center justify-center pt-6 pb-4 px-4">
          <div className="relative h-24 md:h-36 w-full max-w-2xl md:max-w-6xl">
            <Image
              src="/felon-entrepreneur-logo.png"
              alt="Felon Entrepreneur"
              fill
              sizes="(max-width: 768px) 95vw, 1152px"
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="relative px-8 pb-8">
          {/* Career Finder Studio Badge */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-cyber-red" />
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-14 h-14 bg-cyber-red/10 border-2 border-cyber-red/50"
                   style={{ clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)" }}>
                <Briefcase className="w-7 h-7 text-cyber-red" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-cyber-red">Career Finder Studio</p>
                <p className="text-[9px] text-cyber-text-dim uppercase tracking-widest">AI-Powered Job Matching</p>
              </div>
            </div>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyber-red" />
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl md:text-4xl font-black text-white text-center mb-3"
              style={{ textShadow: "0 0 20px rgba(255, 0, 64, 0.5)" }}>
            {hasLifePlan ? `Your Next Move, ${userName}` : "Find Your Next Opportunity"}
          </h1>
          <p className="text-sm text-center text-cyber-text-secondary leading-relaxed max-w-2xl mx-auto">
            {hasLifePlan
              ? "Jobs matched to your Life Plan using AI-powered analysis of your skills, goals, and preferences."
              : "Complete your Life Plan first to unlock AI-powered job matching tailored to your unique journey."}
          </p>

          {/* Bottom tech accent */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="w-2 h-2 bg-cyber-red rounded-full animate-pulse" />
            <div className="h-px w-24 bg-gradient-to-r from-cyber-red via-cyber-red/50 to-transparent" />
            <div className="w-1 h-1 bg-cyber-red/50 rounded-full" />
            <div className="h-px w-24 bg-gradient-to-l from-cyber-red via-cyber-red/50 to-transparent" />
            <div className="w-2 h-2 bg-cyber-red rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Life Plan Status Indicator */}
      {hasLifePlan && !hasSearched && initialQuery && (
        <div className="glass-strong rounded-xl border border-green-500/40 bg-green-500/5 p-6 flex flex-col sm:flex-row items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-500/10 border border-green-500/30 flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-green-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-green-400 mb-1">Life Plan Active - Ready to Find Jobs</p>
            <p className="text-xs text-cyber-text-secondary leading-relaxed mb-4">
              We've pre-filled search terms based on your Life Plan. Click below to find jobs matched to your career goals and preferences.
            </p>
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="cyber-button rounded-xl px-6 py-3 text-sm font-bold transition-all duration-300 hover:shadow-glow-red flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4" />
              Get Recommended Jobs
            </button>
          </div>
        </div>
      )}

      {hasLifePlan && hasSearched && (
        <div className="glass-strong rounded-xl border border-green-500/40 bg-green-500/5 p-5 flex items-start gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/30">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-green-400 mb-1">Life Plan Active</p>
            <p className="text-xs text-cyber-text-secondary leading-relaxed">
              Jobs are matched against your career goals, skills, and preferences from your Life Plan.
            </p>
          </div>
        </div>
      )}

      {/* Detailed Skills Encouragement */}
      {hasLifePlan && !hasDetailedSkills && (
        <div className="glass-strong rounded-xl border border-yellow-500/40 bg-yellow-500/5 p-5 flex items-start gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
            <TrendingUp className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-yellow-400 mb-1">Unlock Better Matches</p>
            <p className="text-xs text-cyber-text-secondary leading-relaxed mb-3">
              Add your detailed skills, certifications, and work history to get higher match scores and unlock AI resume generation.
            </p>
            <Link
              href="/app/profile"
              className="inline-flex items-center gap-2 text-xs font-bold text-yellow-400 hover:text-yellow-300 transition-all hover:gap-3"
            >
              <Target className="w-4 h-4" />
              Add Employment Details
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      {/* Search Section */}
      <div className="glass-strong rounded-2xl border border-cyber-red/30 p-6">
        <div className="space-y-5">
          {/* Search Inputs */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Job Query */}
            <div>
              <label className="block text-xs font-bold text-cyber-text uppercase tracking-wider mb-2">
                <Search className="w-3 h-3 inline mr-1" />
                Job Title or Keywords
              </label>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-text-dim group-focus-within:text-cyber-red transition-colors z-10 pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Software Engineer, Marketing Manager..."
                  className="w-full pl-11 pr-4 py-3.5 bg-[#0f0f0f] border-2 border-cyber-red/30 rounded-xl text-white caret-white text-sm font-semibold placeholder:text-gray-500 focus:border-cyber-red focus:ring-2 focus:ring-cyber-red/20 outline-none transition-all relative z-0"
                  style={{ color: '#ffffff' }}
                />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-bold text-cyber-text uppercase tracking-wider mb-2">
                <MapPin className="w-3 h-3 inline mr-1" />
                City
              </label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-text-dim group-focus-within:text-cyber-red transition-colors z-10 pointer-events-none" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Atlanta, Tampa, Miami..."
                  className="w-full pl-11 pr-4 py-3.5 bg-[#0f0f0f] border-2 border-cyber-red/30 rounded-xl text-white caret-white text-sm font-semibold placeholder:text-gray-500 focus:border-cyber-red focus:ring-2 focus:ring-cyber-red/20 outline-none transition-all relative z-0"
                  style={{ color: '#ffffff' }}
                />
              </div>
            </div>
          </div>

          {/* State and ZIP row */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* State */}
            <div>
              <label className="block text-xs font-bold text-cyber-text uppercase tracking-wider mb-2">
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="FL, GA, CA, TX..."
                maxLength={2}
                className="w-full px-4 py-3.5 bg-[#0f0f0f] border-2 border-cyber-red/30 rounded-xl text-white caret-white text-sm font-semibold placeholder:text-gray-500 focus:border-cyber-red focus:ring-2 focus:ring-cyber-red/20 outline-none transition-all uppercase"
                style={{ color: '#ffffff' }}
              />
            </div>

            {/* ZIP (Optional) */}
            <div>
              <label className="block text-xs font-bold text-cyber-text uppercase tracking-wider mb-2">
                ZIP Code (Optional)
              </label>
              <input
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="For exact location"
                maxLength={5}
                className="w-full px-4 py-3.5 bg-[#0f0f0f] border-2 border-cyber-red/30 rounded-xl text-white caret-white text-sm font-semibold placeholder:text-gray-500 focus:border-cyber-red focus:ring-2 focus:ring-cyber-red/20 outline-none transition-all"
                style={{ color: '#ffffff' }}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="grid gap-4 md:grid-cols-2 pt-2">
            {/* Remote Only Checkbox */}
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <input
                type="checkbox"
                id="remote-only"
                checked={remoteOnly}
                onChange={(e) => setRemoteOnly(e.target.checked)}
                className="w-4 h-4 rounded border-2 border-cyber-red/40 bg-cyber-dark/50 text-cyber-red focus:ring-cyber-red focus:ring-offset-0 cursor-pointer"
              />
              <label htmlFor="remote-only" className="text-sm font-semibold text-cyber-text group-hover:text-white cursor-pointer transition-colors">
                Remote Jobs Only
              </label>
            </div>

            {/* Radius Selector */}
            <div className="relative">
              <label className="block text-xs font-bold text-cyber-text uppercase tracking-wider mb-2">
                Search Radius
              </label>
              <select
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-[#0f0f0f] border-2 border-cyber-red/30 rounded-xl text-white text-sm font-semibold focus:border-cyber-red focus:ring-2 focus:ring-cyber-red/20 outline-none transition-all appearance-none cursor-pointer"
                style={{
                  color: '#ffffff',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23E10600' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center'
                }}
              >
                <option value={5} className="bg-[#0f0f0f] text-white">5 miles</option>
                <option value={10} className="bg-[#0f0f0f] text-white">10 miles</option>
                <option value={25} className="bg-[#0f0f0f] text-white">25 miles</option>
                <option value={50} className="bg-[#0f0f0f] text-white">50 miles</option>
                <option value={100} className="bg-[#0f0f0f] text-white">100 miles</option>
                <option value={200} className="bg-[#0f0f0f] text-white">200 miles (Statewide)</option>
              </select>
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="w-full cyber-button rounded-xl px-6 py-4 text-sm font-bold transition-all duration-300 hover:shadow-glow-red flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isSearching ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Searching Jobs & Matching with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Search Jobs with AI Matching</span>
              </>
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-3 text-sm text-red-400 bg-red-500/10 border-2 border-red-500/40 rounded-xl p-4">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      {hasSearched && (
        <div className="space-y-5">
          {/* Results Header */}
          {results.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between glass-strong rounded-xl border border-cyber-red/30 p-4">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-cyber-red" />
                  <p className="text-sm font-bold text-white">
                    Found <span className="text-cyber-red">{results.length}</span> Matching Jobs
                  </p>
                </div>
                <p className="text-xs text-cyber-text-dim">Sorted by relevance</p>
              </div>

              {/* Tier Limit Warning */}
              {tierLimitReached && upgradeMessage && (
                <div className="glass-strong rounded-xl border border-yellow-500/40 bg-yellow-500/5 p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-yellow-400 mb-1">Result Limit Reached</p>
                    <p className="text-xs text-cyber-text-secondary mb-3">{upgradeMessage}</p>
                    <Link
                      href="/app/profile"
                      className="inline-flex items-center gap-2 text-xs font-bold text-yellow-400 hover:text-yellow-300 transition-all"
                    >
                      <Sparkles className="w-4 h-4" />
                      Upgrade Plan
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Job Cards */}
          {results.length > 0 ? (
            <>
              {/* Results count and page indicator */}
              <div className="flex items-center justify-between text-sm text-cyber-text-secondary mb-4">
                <p>
                  Showing <span className="text-white font-bold">{startIndex + 1}-{Math.min(endIndex, results.length)}</span> of{" "}
                  <span className="text-white font-bold">{results.length}</span> jobs
                </p>
                {totalPages > 1 && (
                  <p>
                    Page <span className="text-white font-bold">{currentPage}</span> of <span className="text-white font-bold">{totalPages}</span>
                  </p>
                )}
              </div>

              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {paginatedResults.map((job) => (
                <div
                  key={job.job_id}
                  className="group relative glass-strong rounded-2xl border border-cyber-red/30 p-6 transition-all duration-300 hover:border-cyber-red/60 hover:shadow-glow-red hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyber-red/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

                  <div className="relative space-y-4">
                    {/* Badges (Recommended & Distance) */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      {job.is_recommended && (
                        <div className="inline-flex items-center gap-1.5 rounded-lg border border-green-500/40 bg-green-500/10 px-3 py-1.5">
                          <Star className="w-3.5 h-3.5 fill-green-400 text-green-400" />
                          <span className="text-xs font-black text-green-400">Recommended</span>
                        </div>
                      )}
                      {job.distance_miles !== null && (
                        <div className="inline-flex items-center gap-1.5 rounded-lg border border-cyber-red/30 bg-cyber-red/5 px-2.5 py-1">
                          <MapPin className="w-3 h-3 text-cyber-red" />
                          <span className="text-xs font-semibold text-cyber-text">{formatDistance(job.distance_miles)}</span>
                        </div>
                      )}
                    </div>

                    {/* Company */}
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-cyber-red flex-shrink-0" />
                      <p className="text-xs font-bold uppercase tracking-wide text-cyber-text-dim truncate">
                        {job.company}
                      </p>
                    </div>

                    {/* Job Title */}
                    <h3 className="text-lg font-black text-white leading-tight line-clamp-2 group-hover:text-cyber-red transition-colors">
                      {job.title}
                    </h3>

                    {/* Location & Type */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-cyber-text-secondary">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="font-medium">{job.location || "Remote"}</span>
                      </div>
                      {job.job_type && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="font-medium capitalize">{job.job_type.replace('_', ' ')}</span>
                        </div>
                      )}
                    </div>

                    {/* Salary */}
                    {formatSalary(job.salary_min, job.salary_max) && (
                      <div className="flex items-center gap-2 glass rounded-lg border border-green-500/30 bg-green-500/5 px-3 py-2">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <p className="text-sm font-bold text-green-400">
                          {formatSalary(job.salary_min, job.salary_max)}
                        </p>
                      </div>
                    )}

                    {/* Matched Keywords */}
                    {job.matched_keywords && job.matched_keywords.length > 0 && (
                      <div className="glass rounded-lg border border-green-500/20 bg-green-500/5 p-3">
                        <p className="text-[10px] font-bold text-green-400 uppercase tracking-wide mb-1.5">Your Skills Match</p>
                        <div className="flex flex-wrap gap-1.5">
                          {job.matched_keywords.slice(0, 3).map((keyword, idx) => (
                            <span
                              key={idx}
                              className="inline-block px-2 py-0.5 rounded-md bg-green-500/10 border border-green-500/30 text-[10px] font-semibold text-green-400 uppercase"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Apply Button */}
                    <a
                      href={job.apply_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full cyber-button rounded-xl px-4 py-3.5 text-sm font-bold transition-all duration-300 hover:shadow-glow-red flex items-center justify-center gap-2.5 group/btn"
                    >
                      <Zap className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                      Apply Now
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col gap-4 items-center">
                {/* Page indicator for mobile */}
                <div className="text-sm text-cyber-text-secondary md:hidden">
                  Page <span className="text-white font-bold">{currentPage}</span> of <span className="text-white font-bold">{totalPages}</span>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {/* Previous Button */}
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 md:px-4 bg-cyber-black-lighter border-2 border-cyber-red/30 rounded-lg text-white font-bold text-xs md:text-sm hover:border-cyber-red hover:shadow-glow-red transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-cyber-red/30 disabled:hover:shadow-none"
                  >
                    Previous
                  </button>

                  {/* Page Numbers - hidden on very small mobile */}
                  <div className="hidden sm:flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // Show first page, last page, current page, and pages around current
                      const showPage =
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1);

                      const showEllipsis =
                        (page === 2 && currentPage > 3) ||
                        (page === totalPages - 1 && currentPage < totalPages - 2);

                      if (showEllipsis) {
                        return (
                          <span key={page} className="px-2 text-cyber-text-dim">
                            ...
                          </span>
                        );
                      }

                      if (!showPage) return null;

                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
                            currentPage === page
                              ? "bg-cyber-red text-white shadow-glow-red"
                              : "bg-cyber-black-lighter border-2 border-cyber-red/30 text-white hover:border-cyber-red hover:shadow-glow-red"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 md:px-4 bg-cyber-black-lighter border-2 border-cyber-red/30 rounded-lg text-white font-bold text-xs md:text-sm hover:border-cyber-red hover:shadow-glow-red transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-cyber-red/30 disabled:hover:shadow-none"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
          ) : (
            !isSearching && (
              <div className="glass-strong rounded-2xl border border-cyber-red/30 p-16 text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-cyber-red/10 border border-cyber-red/30 mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-cyber-text-dim" />
                </div>
                <p className="text-xl font-bold text-white mb-2">No Jobs Found</p>
                <p className="text-sm text-cyber-text-secondary max-w-md mx-auto">
                  Try adjusting your search criteria, removing filters, or searching for different keywords.
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
