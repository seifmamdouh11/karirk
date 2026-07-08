"use client";

import React from "react";
import Link from "next/link";
import JobCard from "../jobs/JobCard";
import { useLanguage } from "@/lib/LanguageContext";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface FeaturedJobsProps {
  jobs: any[];
}

export default function FeaturedJobs({ jobs }: FeaturedJobsProps) {
  const { locale, t } = useLanguage();
  const isRtl = locale === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-2">
            {t("home.featuredJobsTitle")}
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            {t("home.featuredJobsSubtitle")}
          </p>
        </div>
        <Link 
          href="/jobs" 
          className="group flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
        >
          <span>{t("home.exploreAllJobs")}</span>
          <ArrowIcon className="w-4 h-4 transform group-hover:scale-110 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="w-full p-12 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-center">
          <p className="text-zinc-500 dark:text-zinc-400">{t("home.noJobs")}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {jobs.map((job) => (
            <JobCard key={job._id.toString()} job={job} />
          ))}
        </div>
      )}

      {jobs.length > 0 && (
        <div className="mt-8 flex justify-center sm:hidden">
          <Link 
            href="/jobs" 
            className="w-full text-center py-3 px-4 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
          >
            {t("home.exploreAllJobs")}
          </Link>
        </div>
      )}
    </div>
  );
}
