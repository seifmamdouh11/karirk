"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface LatestPostsProps {
  posts: any[];
}

export default function LatestPosts({ posts }: LatestPostsProps) {
  const { locale, t } = useLanguage();

  return (
    <div className="w-full rounded-4xl bg-white/95 dark:bg-zinc-950/90 border border-zinc-200/60 dark:border-zinc-800/80 shadow-sm backdrop-blur-xl p-6">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-zinc-950 dark:text-white">
            {t("home.postsTitle")}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 max-w-md">
            {t("home.postsSubtitle")}
          </p>
        </div>
        <Link
          href="/posts"
          className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
        >
          <span>{t("home.readAllArticles")}</span>
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/40 rounded-2xl">
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">{t("home.noArticles")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {posts.map((post) => (
            <article
              key={post._id.toString()}
              className="group flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 rounded-2xl p-5 hover:shadow-xl hover:shadow-zinc-200/40 dark:hover:shadow-none hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-300"
            >
              {/* Category tag */}
              <div className="flex items-center justify-between mb-4">
                <Link
                  href={`/categories/${post.category}`}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-650 dark:text-zinc-300 capitalize transition-colors"
                >
                  {post.category.replace("-", " ")}
                </Link>
                <span className="flex items-center gap-1 text-[11px] text-zinc-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{locale === "ar" ? "قراءة 3 دقائق" : "3 min read"}</span>
                </span>
              </div>

              {/* Title */}
              <Link href={`/posts/${post.slug || post._id}`} className="block flex-1">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                  {post.title}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2.5 line-clamp-3 leading-relaxed">
                  {post.description}
                </p>
              </Link>

              {/* Read button */}
              <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-850 flex items-center justify-start">
                <Link
                  href={`/posts/${post.slug || post._id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:text-blue-500 dark:group-hover:text-blue-300 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{t("home.readArticle")}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="mt-8 text-center sm:hidden">
        <Link
          href="/posts"
          className="inline-flex items-center justify-center gap-1.5 w-full py-3 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
        >
          <span>{t("home.readAllArticles")}</span>
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </Link>
      </div>
    </div>
  );
}
