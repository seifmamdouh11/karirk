import React from "react";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import Link from "next/link";
import { ArrowLeft, MapPin, DollarSign, Calendar, Briefcase, Globe, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function JobDetailPage({ params }: PageProps) {
  const { slug } = await params;
  await connectDB();

  // Find job by slug or ID
  const job = await Job.findOne({
    $or: [{ slug }, { _id: slug.length === 24 ? slug : undefined }]
  }).lean();

  if (!job) {
    notFound();
  }

  const typeLabels: Record<string, string> = {
    "full-time": "Full Time",
    "part-time": "Part Time",
    "contract": "Contract",
    "internship": "Internship",
    "remote": "Remote",
    "hybrid": "Hybrid"
  };

  const typeStyles: Record<string, string> = {
    "full-time": "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30",
    "part-time": "bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/30",
    "contract": "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/30",
    "internship": "bg-pink-50 text-pink-700 border-pink-100 dark:bg-pink-950/20 dark:text-pink-400 dark:border-pink-900/30",
    "remote": "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30",
    "hybrid": "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30"
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Back to Jobs Link */}
      <Link
        href="/jobs"
        className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
        <span>Back to Job Listings</span>
      </Link>

      {/* Hero section card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6 relative overflow-hidden">
        {/* Background accent blurs */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${typeStyles[job.type] || "bg-zinc-100 text-zinc-800"}`}>
                {typeLabels[job.type] || job.type}
              </span>
              <Link
                href={`/categories/${job.category}`}
                className="text-xs text-zinc-400 font-medium hover:text-blue-600 capitalize transition-colors"
              >
                {job.category.replace("-", " ")}
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              {job.title}
            </h1>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              {job.company}
            </p>
          </div>

          <a
            href={job.applyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/20 active:scale-98 transition-all"
          >
            <span>Apply Now</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 px-5 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl text-xs text-zinc-600 dark:text-zinc-300">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-zinc-400" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-zinc-400" />
            <span>{job.salary}</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-zinc-400" />
            <span>{job.country}</span>
          </div>
          {job.createdAt && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-zinc-400" />
              <span>
                Posted: {new Date(job.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                })}
              </span>
            </div>
          )}
        </div>

        {/* Job Description Content */}
        <div className="flex flex-col gap-4 mt-2">
          <h3 className="text-lg font-bold text-zinc-950 dark:text-white">
            Job Description & Requirements
          </h3>
          <div className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed space-y-4 whitespace-pre-line">
            {job.description}
          </div>
        </div>
      </div>
    </div>
  );
}

