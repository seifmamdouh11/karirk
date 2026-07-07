"use client";

import React from "react";
import JobCard from "./JobCard";
import { Briefcase, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

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
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center gap-4">
        {/* Loading spinner */}
        <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">{t("jobs.loading")}</p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/40 rounded-2xl p-8 flex flex-col items-center justify-center max-w-lg mx-auto mt-6">
        <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-500 mb-5">
          <Briefcase className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">{t("jobs.noJobs")}</h3>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
          {t("jobs.noJobsDesc")}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-bold text-zinc-400 dark:text-zinc-555 uppercase tracking-wider">
          {t("jobs.availablePositions")} ({jobs.length})
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobCard key={job._id.toString()} job={job} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12 pt-6 border-t border-zinc-100 dark:border-zinc-800/50">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-zinc-200 dark:border-zinc-800/60 text-zinc-600 dark:text-zinc-350 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
            <span>{t("jobs.prev")}</span>
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }, (_, idx) => {
              const pNum = idx + 1;
              return (
                <button
                  key={pNum}
                  onClick={() => onPageChange(pNum)}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    page === pNum
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/15"
                      : "border border-zinc-200 dark:border-zinc-800/60 text-zinc-600 dark:text-zinc-350 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
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
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-zinc-200 dark:border-zinc-800/60 text-zinc-600 dark:text-zinc-350 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <span>{t("jobs.next")}</span>
            <ChevronRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      )}
    </div>
  );
}
