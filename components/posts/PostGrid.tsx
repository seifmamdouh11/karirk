"use client";

import React from "react";
import PostCard from "./PostCard";
import { BookOpen } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface PostGridProps {
  posts: any[];
  loading: boolean;
}

export default function PostGrid({ posts, loading }: PostGridProps) {
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">{t("posts.loading")}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/40 rounded-2xl p-8 flex flex-col items-center justify-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-500 mb-5">
          <BookOpen className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">{t("posts.noArticles")}</h3>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
          {t("posts.noArticlesDesc")}
        </p>
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
