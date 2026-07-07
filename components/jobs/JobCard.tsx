"use client";

import React from "react";
import Link from "next/link";
import { MapPin, DollarSign, Calendar, ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

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

  // Generate a nice colorful circle avatar for the company name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "from-blue-500 to-blue-700 shadow-blue-500/10",
      "from-sky-500 to-blue-600 shadow-sky-500/10",
      "from-blue-600 to-sky-500 shadow-blue-500/10",
      "from-blue-500 to-sky-600 shadow-sky-500/10",
      "from-sky-600 to-blue-700 shadow-blue-500/10"
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }
    return colors[sum % colors.length];
  };

  const typeLabels: Record<string, string> = {
    "full-time": t("jobs.full-time"),
    "part-time": t("jobs.part-time"),
    "contract": t("jobs.contract"),
    "internship": t("jobs.internship"),
    "remote": t("jobs.remote"),
    "hybrid": t("jobs.hybrid")
  };

  const typeStyles: Record<string, string> = {
    "full-time": "bg-blue-50 text-blue-700 border-blue-100",
    "part-time": "bg-blue-50 text-blue-700 border-blue-100",
    "contract": "bg-blue-50 text-blue-700 border-blue-100",
    "internship": "bg-blue-50 text-blue-700 border-blue-100",
    "remote": "bg-blue-50 text-blue-700 border-blue-100",
    "hybrid": "bg-blue-50 text-blue-700 border-blue-100"
  };

  const getLocalizedLocation = (loc: string) => {
    if (locale !== "ar") return loc;
    return loc
      .replace("Saudi Arabia", "السعودية")
      .replace("United Arab Emirates", "الإمارات")
      .replace("Egypt", "مصر")
      .replace("Jordan", "الأردن")
      .replace("Riyadh", "الرياض")
      .replace("Dubai", "دبي")
      .replace("Cairo", "القاهرة")
      .replace("Amman", "عمان");
  };

  return (
    <div className="group relative bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 rounded-2xl p-5 hover:shadow-xl hover:shadow-zinc-200/40 dark:hover:shadow-none hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-300">
      
      {/* Top Section: Company logo, Titles & Job Type Badge */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-4 min-w-0 flex-1">
          {/* Avatar logo */}
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${getAvatarColor(job.company)} flex items-center justify-center text-white font-bold text-base shadow-md shrink-0`}>
            {getInitials(job.company)}
          </div>
          
          {/* Title and Company */}
          <div className="flex-1 min-w-0">
            <Link href={`/jobs/${job.slug || job._id}`} className="block">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                {job.title}
              </h3>
            </Link>
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 block mt-0.5">
              {job.company}
            </span>
          </div>
        </div>

        {/* Job Type Badge & Arrow */}
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${typeStyles[job.type] || "bg-zinc-100 text-zinc-800"}`}>
            {typeLabels[job.type] || job.type}
          </span>
          <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-blue-600 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1 transition-all" />
        </div>
      </div>

      {/* Mid Section: Description snippet */}
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-4 line-clamp-2">
        {job.description}
      </p>

      {/* Meta tags / info row */}
      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/60 text-xs text-zinc-500 dark:text-zinc-400">
        
        <div className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-zinc-400" />
          <span>{getLocalizedLocation(job.location)}</span>
        </div>

        <div className="flex items-center gap-1">
          <DollarSign className="w-3.5 h-3.5 text-zinc-400" />
          <span>{job.salary}</span>
        </div>

        {job.createdAt && (
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
            <span>
              {new Date(job.createdAt).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
