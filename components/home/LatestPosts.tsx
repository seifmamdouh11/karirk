"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import PostCard from "../posts/PostCard";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface LatestPostsProps {
  posts: any[];
}

export default function LatestPosts({ posts }: LatestPostsProps) {
  const { locale, t } = useLanguage();
  const isRtl = locale === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-2">
            {t("home.postsTitle") || (isRtl ? "أحدث المقالات" : "Industry Insights")}
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            {t("home.postsSubtitle") || (isRtl ? "رؤى خبراء وتقارير عن سوق العمل" : "Expert career guidance and local market reports")}
          </p>
        </div>
        <Link 
          href="/posts" 
          className="group flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
        >
          <span>{t("home.readAllArticles") || (isRtl ? "قراءة كل المقالات" : "Read All Articles")}</span>
          <ArrowIcon className="w-4 h-4 transform group-hover:scale-110 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="w-full p-12 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-center">
          <p className="text-zinc-500 dark:text-zinc-400">{t("home.noArticles") || "No articles available yet."}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <PostCard key={post._id.toString()} post={post} />
          ))}
        </div>
      )}

      {posts.length > 0 && (
        <div className="mt-8 flex justify-center sm:hidden">
          <Link 
            href="/posts" 
            className="w-full text-center py-3 px-4 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
          >
            {t("home.readAllArticles") || "Read All Articles"}
          </Link>
        </div>
      )}
    </div>
  );
}
