import React from "react";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import Job from "@/models/Job";
import JobCard from "@/components/jobs/JobCard";
import Link from "next/link";
import { ArrowLeft, Briefcase, Grid } from "lucide-react";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const { slug } = await params;
  await connectDB();

  // Find category document
  const categoryDoc = await Category.findOne({ slug }).lean();
  if (!categoryDoc) {
    notFound();
  }

  // Find all category slugs under this (including subcategories if it's a parent)
  let categorySlugs = [categoryDoc.slug];
  if (!categoryDoc.parent) {
    const subcategories = await Category.find({ parent: categoryDoc._id }).lean();
    if (subcategories.length > 0) {
      categorySlugs = [categoryDoc.slug, ...subcategories.map((sub: any) => sub.slug)];
    }
  }

  // Fetch all active jobs in these categories
  const jobs = await Job.find({
    status: "active",
    category: { $in: categorySlugs }
  })
    .sort({ createdAt: -1 })
    .lean();

  const serializedJobs = JSON.parse(JSON.stringify(jobs));

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 flex flex-col gap-8">
      {/* Back Link */}
      <div>
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>Back to All Jobs</span>
        </Link>
      </div>

      {/* Category Header */}
      <div className="flex flex-col gap-2 border-b border-zinc-200/50 dark:border-zinc-800/40 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-450 dark:text-zinc-550 uppercase tracking-widest">
          <Grid className="w-4 h-4" />
          <span>Industry Category</span>
        </div>
        <h1 className="text-3xl font-extrabold font-display tracking-tight text-zinc-950 dark:text-white capitalize">
          {categoryDoc.name} Jobs
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Browse open vacancies and career pathways in the {categoryDoc.name} industry.
        </p>
      </div>

      {/* Job Grid / Listings */}
      {serializedJobs.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/40 rounded-3xl p-8 flex flex-col items-center justify-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-500 mb-5">
            <Briefcase className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">No Jobs in this Category</h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
            There are currently no open positions listed under &ldquo;{categoryDoc.name}&rdquo;. Check back later or explore other career options.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Open Positions ({serializedJobs.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {serializedJobs.map((job: any) => (
              <JobCard key={job._id.toString()} job={job} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
