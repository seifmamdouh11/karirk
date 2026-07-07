"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface PostCardProps {
  post: {
    _id: any;
    title: string;
    slug?: string;
    description: string;
    category: string;
    createdAt?: Date | string;
  };
}

export default function PostCard({ post }: PostCardProps) {
  const { locale, t } = useLanguage();

  const getCategoryName = (name: string) => {
    return name.replace("-", " ");
  };

  return (
    <article className="group flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 rounded-2xl p-5 hover:shadow-xl hover:shadow-zinc-200/40 dark:hover:shadow-none hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-300">
      {/* Category and time tag */}
      <div className="flex items-center justify-between mb-4">
        <Link
          href={`/categories/${post.category}`}
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-650 dark:text-zinc-300 capitalize transition-colors"
        >
          {getCategoryName(post.category)}
        </Link>
        <span className="flex items-center gap-1 text-[11px] text-zinc-400">
          <Clock className="w-3.5 h-3.5" />
          <span>{locale === "ar" ? "قراءة 3 دقائق" : "3 min read"}</span>
        </span>
      </div>

      {/* Title & Description */}
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
  );
}
