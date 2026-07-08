"use client";

import React from "react";
import PostCard from "./PostCard";
import { useLanguage } from "@/lib/LanguageContext";
import { Loader2 } from "lucide-react";

interface PostGridProps {
  posts: any[];
  loading: boolean;
}

export default function PostGrid({ posts, loading }: PostGridProps) {
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
        <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
        <p className="text-zinc-500 dark:text-zinc-400 font-medium">{t("posts.loading") || "Loading..."}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center text-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">{t("posts.noPostsTitle")}</h3>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-md">{t("posts.noPostsDesc")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard key={post._id.toString()} post={post} />
      ))}
    </div>
  );
}
