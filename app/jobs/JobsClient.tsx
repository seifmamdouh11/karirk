"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import FilterBar from "@/components/jobs/FilterBar";
import JobGrid from "@/components/jobs/JobGrid";
import AdBanner from "@/components/layout/AdBanner";

import { useLanguage } from "@/lib/LanguageContext";

export default function JobsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

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
  const [debouncedQ, setDebouncedQ] = useState(filters.q);

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

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setDebouncedQ(filters.q);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [filters.q]);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const params: any = {
          page,
          limit: 9,
        };
        if (debouncedQ) params.q = debouncedQ;
        if (filters.category) params.category = filters.category;
        if (filters.type) params.type = filters.type;
        if (filters.country) params.country = filters.country;
        if (featured) params.featured = featured;

        const res = await axios.get("/api/jobs", { params });
        if (res.data && res.data.success) {
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

    const params = new URLSearchParams();
    if (newFilters.q) params.set("q", newFilters.q);
    if (newFilters.category) params.set("category", newFilters.category);
    if (newFilters.type) params.set("type", newFilters.type);
    if (newFilters.country) params.set("country", newFilters.country);
    if (featured) params.set("featured", featured);
    
    params.set("page", "1");

    router.replace(`/jobs?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.category) params.set("category", filters.category);
    if (filters.type) params.set("type", filters.type);
    if (filters.country) params.set("country", filters.country);
    if (featured) params.set("featured", featured);
    
    params.set("page", newPage.toString());

    router.replace(`/jobs?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium text-sm">
          {t("jobs.discover")}
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          {t("jobs.title")}
        </h1>
        <p className="text-lg text-zinc-500 dark:text-zinc-400">
          {t("jobs.subtitle")}
        </p>
      </div>

      <div className="space-y-8">
        <FilterBar filters={filters} onChange={handleFilterChange} />

        {/* AdSense Top Banner */}
        <AdBanner dataAdSlot="TOP_BANNER_SLOT_ID" className="h-[90px] md:h-[120px]" />

        <div className="min-h-[400px]">
          <JobGrid
            jobs={jobs}
            loading={loading}
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
        
        {/* AdSense Bottom Banner */}
        {jobs.length > 0 && (
          <div className="pt-8">
            <AdBanner dataAdSlot="BOTTOM_BANNER_SLOT_ID" className="h-[250px]" />
          </div>
        )}
      </div>
    </div>
  );
}
