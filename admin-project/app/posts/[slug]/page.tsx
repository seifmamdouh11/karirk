import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import Link from "next/link";
import { ArrowLeft, Edit, Calendar, Tag, FileText } from "lucide-react";

type AdminPostPreview = {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  status?: string;
  slug?: string;
  createdAt?: string | Date;
};

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PostPreviewPage({ params }: Props) {
  const { slug } = await params;
  await connectDB();

  const post = await Post.findOne({ slug }).lean() as AdminPostPreview | null;
  if (!post) notFound();

  const createdAtValue = post.createdAt ? new Date(post.createdAt as string | number | Date) : null;
  const formattedDate = createdAtValue
    ? createdAtValue.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

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
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Article Preview</p>
              <p className="text-sm font-semibold text-zinc-800 truncate max-w-xs">{post.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              post.status === "published"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${post.status === "published" ? "bg-emerald-500 animate-pulse" : "bg-amber-400"}`} />
              {post.status}
            </span>
            <Link
              href={`/admin/posts/${post._id}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-600/20"
            >
              <Edit className="w-4 h-4" />
              Edit Article
            </Link>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <article className="bg-white rounded-3xl border border-zinc-200 shadow-xl shadow-zinc-200/40 overflow-hidden">
          {/* Article Header */}
          <div className="p-10 border-b border-zinc-100">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold">
                <Tag className="w-3 h-3" />
                {post.category}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400">
                <Calendar className="w-3 h-3" />
                {formattedDate}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-zinc-900 leading-snug">{post.title}</h1>
          </div>

          {/* Article Body */}
          <div className="p-10">
            <div className="flex items-center gap-2 mb-6 text-sm font-semibold text-zinc-500">
              <FileText className="w-4 h-4" />
              Content
            </div>
            <div className="prose prose-zinc max-w-none">
              <p className="text-zinc-700 leading-relaxed whitespace-pre-wrap text-[15px]">
                {post.description}
              </p>
            </div>
          </div>

          {/* Article Footer */}
          <div className="px-10 py-6 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
            <div className="text-xs text-zinc-400 font-mono">
              ID: {String(post._id)} · Slug: {post.slug}
            </div>
            <Link
              href={`/admin/posts/${post._id}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
