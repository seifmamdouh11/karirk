import React from "react";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import Link from "next/link";
import { ArrowLeft, Clock, BookOpen, Share2 } from "lucide-react";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export default async function PostDetailPage({ params }: PageProps) {
  const { slug } = await params;
  await connectDB();

  // Find post by slug or ID
  const post = await Post.findOne({
    $or: [{ slug }, { _id: slug.length === 24 ? slug : undefined }]
  }).lean();

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Back to Resources Link */}
      <Link
        href="/posts"
        className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
        <span>Back to Insights</span>
      </Link>

      <article className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
        {/* Header Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-150 dark:border-zinc-800/60 pb-6">
          <div className="flex items-center gap-3">
            <Link
              href={`/categories/${post.category}`}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 capitalize transition-colors"
            >
              {post.category.replace("-", " ")}
            </Link>
            <span className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
              <Clock className="w-4 h-4" />
              <span>3 min read</span>
            </span>
          </div>

          {post.createdAt && (
            <span className="text-xs text-zinc-400 font-medium">
              Published: {new Date(post.createdAt).toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric"
              })}
            </span>
          )}
        </div>

        {/* Title and Intro */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white leading-tight tracking-tight">
            {post.title}
          </h1>
        </div>

        {/* Article Body Content */}
        <div className="mt-4 flex flex-col gap-6 text-zinc-600 dark:text-zinc-300 leading-relaxed text-base whitespace-pre-line">
          {/* Main article content - using description since it's the main field on the Post model */}
          {post.description}
        </div>

        {/* Shared / Bottom area */}
        <div className="mt-8 pt-6 border-t border-zinc-150 dark:border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400">
          <span className="font-semibold">Karirak Editorial Insights</span>
          <button className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors">
            <Share2 className="w-4 h-4" />
            <span>Share Article</span>
          </button>
        </div>
      </article>
    </div>
  );
}

