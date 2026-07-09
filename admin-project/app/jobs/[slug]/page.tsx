import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import Link from "next/link";
import { ArrowLeft, Edit, Calendar, Tag, MapPin, Building2, DollarSign, Globe, ExternalLink } from "lucide-react";

type AdminJobPreview = {
  _id: string;
  title: string;
  company?: string;
  status?: string;
  type?: string;
  createdAt?: string | Date;
  location?: string;
  salary?: string;
  country?: string;
  applyLink?: string;
  category?: string;
  slug?: string;
};

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function JobPreviewPage({ params }: Props) {
  const { slug } = await params;
  await connectDB();

  const job = await Job.findOne({ slug }).lean() as AdminJobPreview | null;
  if (!job) notFound();

  const formattedDate = new Date(job.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const typeColors: Record<string, string> = {
    "full-time": "bg-blue-50 text-blue-700 border-blue-200",
    "part-time": "bg-violet-50 text-violet-700 border-violet-200",
    "contract": "bg-amber-50 text-amber-700 border-amber-200",
    "remote": "bg-teal-50 text-teal-700 border-teal-200",
    "hybrid": "bg-indigo-50 text-indigo-700 border-indigo-200",
    "internship": "bg-pink-50 text-pink-700 border-pink-200",
    "temporary": "bg-orange-50 text-orange-700 border-orange-200",
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-zinc-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/manage"
              className="p-2 text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-zinc-200 hover:border-indigo-200"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Job Preview</p>
              <p className="text-sm font-semibold text-zinc-800 truncate max-w-xs">{job.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              job.status === "active"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-zinc-100 text-zinc-600 border-zinc-200"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${job.status === "active" ? "bg-emerald-500 animate-pulse" : "bg-zinc-400"}`} />
              {job.status}
            </span>
            <Link
              href={`/admin/jobs/${job._id}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-600/20"
            >
              <Edit className="w-4 h-4" />
              Edit Job
            </Link>
          </div>
        </div>
      </div>

      {/* Job Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <article className="bg-white rounded-3xl border border-zinc-200 shadow-xl shadow-zinc-200/40 overflow-hidden">
          {/* Job Header */}
          <div className="p-10 border-b border-zinc-100">
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${typeColors[job.type] || "bg-zinc-50 text-zinc-600 border-zinc-200"}`}>
                {job.type}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold">
                <Tag className="w-3 h-3" />
                {job.category}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400">
                <Calendar className="w-3 h-3" />
                {formattedDate}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-zinc-900 leading-snug mb-2">{job.title}</h1>

            {/* Meta info */}
            <div className="flex flex-wrap gap-5 mt-5">
              {job.company && (
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <Building2 className="w-4 h-4 text-zinc-400" />
                  <span className="font-medium">{job.company}</span>
                </div>
              )}
              {job.location && (
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <MapPin className="w-4 h-4 text-zinc-400" />
                  <span>{job.location}</span>
                </div>
              )}
              {job.country && (
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <Globe className="w-4 h-4 text-zinc-400" />
                  <span>{job.country}</span>
                </div>
              )}
              {job.salary && (
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <DollarSign className="w-4 h-4 text-zinc-400" />
                  <span>{job.salary}</span>
                </div>
              )}
            </div>
          </div>

          {/* Job Description */}
          <div className="p-10">
            <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Job Description</h2>
            <p className="text-zinc-700 leading-relaxed whitespace-pre-wrap text-[15px]">
              {job.description}
            </p>
          </div>

          {/* Apply Link + Footer */}
          <div className="px-10 py-6 bg-zinc-50 border-t border-zinc-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-xs text-zinc-400 font-mono">
              ID: {String(job._id)} · Slug: {job.slug}
            </div>
            <div className="flex items-center gap-3">
              {job.applyLink && (
                <a
                  href={job.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Apply Link
                </a>
              )}
              <Link
                href={`/admin/jobs/${job._id}/edit`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
