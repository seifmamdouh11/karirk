"use client";

import React from "react";
import Link from "next/link";
import JobCard from "../jobs/JobCard";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface FeaturedJobsProps {
  jobs: any[];
}

export default function FeaturedJobs({ jobs }: FeaturedJobsProps) {
  const { t } = useLanguage();

  return (
    <div className="w-full rounded-4xl bg-white/95 dark:bg-zinc-950/90 border border-zinc-200/60 dark:border-zinc-800/80 shadow-sm backdrop-blur-xl p-6">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-zinc-950 dark:text-white">
            {t("home.featuredJobsTitle")}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 max-w-md">
            {t("home.featuredJobsSubtitle")}
          </p>
        </div>
        <Link
          href="/jobs"
          className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
        >
          <span>{t("home.exploreAllJobs")}</span>
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/40 rounded-2xl">
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">{t("home.noJobs")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {jobs.map((job) => (
            <JobCard key={job._id.toString()} job={job} />
          ))}
        </div>
      )}

      <div className="mt-8 text-center sm:hidden">
        <Link
          href="/jobs"
          className="inline-flex items-center justify-center gap-1.5 w-full py-3 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
        >
          <span>{t("home.exploreAllJobs")}</span>
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </Link>
      </div>
    </div>
  );
}
