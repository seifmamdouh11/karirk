"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import FilterBar from "@/components/jobs/FilterBar";
import JobGrid from "@/components/jobs/JobGrid";
import { Sparkles } from "lucide-react";

import { useLanguage } from "@/lib/LanguageContext";

function JobsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  // Get initial values from URL search params
  const initialQ = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialType = searchParams.get("type") || "";
  const initialCountry = searchParams.get("country") || "";
  const featured = searchParams.get("featured") || "";

  const [filters, setFilters] = useState({
    q: initialQ,
    category: initialCategory,
    type: initialType,
    country: initialCountry,
  });

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Debounced search query
  const [debouncedQ, setDebouncedQ] = useState(filters.q);

  // URL query sync
  useEffect(() => {
    setFilters({
      q: searchParams.get("q") || "",
      category: searchParams.get("category") || "",
      type: searchParams.get("type") || "",
      country: searchParams.get("country") || "",
    });
    const pageVal = parseInt(searchParams.get("page") || "1", 10);
    setPage(pageVal);
  }, [searchParams]);

  // Debounce the text query by 300ms
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setDebouncedQ(filters.q);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [filters.q]);

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const params: any = {
          page,
          limit: 9, // 9 items per page (3 columns x 3 rows)
        };
        if (debouncedQ) params.q = debouncedQ;
        if (filters.category) params.category = filters.category;
        if (filters.type) params.type = filters.type;
        if (filters.country) params.country = filters.country;
        if (featured) params.featured = featured;

        const res = await axios.get("/api/jobs", { params });
        if (res.data && res.data.success) {
          // Verify response structure and parse jobs list
          setJobs(res.data.data || []);
          setTotalPages(res.data.totalPages || 1);
        } else {
          setJobs([]);
          setTotalPages(1);
        }
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        setJobs([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [debouncedQ, filters.category, filters.type, filters.country, featured, page]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);

    // Sync URL search params
    const params = new URLSearchParams();
    if (newFilters.q) params.set("q", newFilters.q);
    if (newFilters.category) params.set("category", newFilters.category);
    if (newFilters.type) params.set("type", newFilters.type);
    if (newFilters.country) params.set("country", newFilters.country);
    if (featured) params.set("featured", featured);
    
    // Reset page to 1 on filter change
    params.set("page", "1");

    router.replace(`/jobs?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    // Sync page state and URL
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.category) params.set("category", filters.category);
    if (filters.type) params.set("type", filters.type);
    if (filters.country) params.set("country", filters.country);
    if (featured) params.set("featured", featured);
    
    params.set("page", newPage.toString());

    router.replace(`/jobs?${params.toString()}`);
    // Scroll window to top of the listings smoothly on page change
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
      {/* Title Header */}
      <div className="text-center md:text-start flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200/50 dark:border-zinc-800/40 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>{t("jobs.discover")}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-zinc-950 dark:text-white">
            {t("jobs.title")}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm sm:text-base max-w-xl leading-relaxed">
            {t("jobs.subtitle")}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {/* Top Filter Panel */}
        <div className="w-full">
          <FilterBar filters={filters} onChange={handleFilterChange} />
        </div>

        {/* Job Listings Grid */}
        <div className="w-full">
          <JobGrid
            jobs={jobs}
            loading={loading}
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1440px] mx-auto px-4 py-20 flex justify-center items-center">
          <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      }
    >
      <JobsContent />
    </Suspense>
  );
}
