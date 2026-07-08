"use client";

import React from "react";
import JobCard from "./JobCard";
import { useLanguage } from "@/lib/LanguageContext";
import { Loader2, ChevronRight, ChevronLeft } from "lucide-react";

interface JobGridProps {
  jobs: any[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function JobGrid({
  jobs = [],
  loading,
  page,
  totalPages,
  onPageChange,
}: JobGridProps) {
  const { locale, t } = useLanguage();
  const isRtl = locale === "ar";
  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;

  if (loading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
        <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
        <p className="text-zinc-500 dark:text-zinc-400 font-medium">{t("jobs.loading") || "Loading..."}</p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center text-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">{t("jobs.noJobsTitle")}</h3>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-md">{t("jobs.noJobsDesc")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
          {t("jobs.availablePositions")} <span className="text-zinc-500 dark:text-zinc-400 font-medium text-base">({jobs.length})</span>
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {jobs.map((job) => (
          <JobCard key={job._id.toString()} job={job} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="flex items-center justify-center w-10 h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <PrevIcon className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, idx) => {
              const pNum = idx + 1;
              const isActive = pNum === page;
              return (
                <button
                  key={pNum}
                  onClick={() => onPageChange(pNum)}
                  className={`flex items-center justify-center w-10 h-10 rounded-xl font-medium transition-colors ${
                    isActive 
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" 
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-indigo-600 dark:hover:text-indigo-400"
                  }`}
                >
                  {pNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="flex items-center justify-center w-10 h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <NextIcon className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
