"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { MapPin, Building2, Banknote, Clock, ArrowLeft, ArrowRight, Briefcase } from "lucide-react";

interface JobCardProps {
  job: {
    _id: any;
    title: string;
    slug?: string;
    description: string;
    location: string;
    salary: string;
    type: string;
    company: string;
    category: string;
    country: string;
    createdAt?: Date | string;
  };
}

export default function JobCard({ job }: JobCardProps) {
  const { locale, t } = useLanguage();
  const isRtl = locale === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const typeLabels: Record<string, string> = {
    "full-time": t("jobs.full-time"),
    "part-time": t("jobs.part-time"),
    contract: t("jobs.contract"),
    internship: t("jobs.internship"),
    remote: t("jobs.remote"),
    hybrid: t("jobs.hybrid"),
  };

  return (
    <Link 
      href={`/jobs/${job.slug || job._id}`}
      className="group relative flex flex-col p-5 sm:p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shrink-0 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 transition-colors">
            <Building2 className="w-6 h-6 text-zinc-500 dark:text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1 line-clamp-1">
              {job.title}
            </h3>
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              {job.company}
            </span>
          </div>
        </div>
      </div>

      <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-6 leading-relaxed">
        {job.description}
      </p>

      <div className="mt-auto flex flex-wrap items-center gap-4 text-xs sm:text-sm font-medium text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-800/50 px-2 py-1 rounded-md">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="line-clamp-1">{job.location}</span>
        </div>

        {job.salary && (
          <div className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-800/50 px-2 py-1 rounded-md">
            <Banknote className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span className="line-clamp-1 text-emerald-700 dark:text-emerald-400">{job.salary}</span>
          </div>
        )}

        {job.type && (
          <div className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-800/50 px-2 py-1 rounded-md">
            <Briefcase className="w-4 h-4 shrink-0" />
            <span className="line-clamp-1">{typeLabels[job.type] || job.type}</span>
          </div>
        )}

        {job.createdAt && (
          <div className="flex items-center gap-1.5 ms-auto">
            <Clock className="w-4 h-4 shrink-0" />
            <span>
              {new Date(job.createdAt).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        )}
      </div>

      <div className="absolute top-6 rtl:left-6 ltr:right-6 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-0 rtl:translate-x-[-10px] ltr:translate-x-[10px] transition-all duration-300 hidden sm:block">
        <ArrowIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
      </div>
    </Link>
  );
}
