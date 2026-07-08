"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { Clock, ArrowRight, ArrowLeft } from "lucide-react";

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
  const isRtl = locale === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const getCategoryName = (name: string) => {
    return name.replace(/-/g, " ");
  };

  return (
    <Link 
      href={`/posts/${post.slug || post._id}`}
      className="group flex flex-col p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 h-full"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold uppercase tracking-wider">
          {getCategoryName(post.category)}
        </span>
        <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 ms-auto">
          <Clock className="w-3.5 h-3.5" />
          {locale === "ar" ? "قراءة 3 دقائق" : "3 min read"}
        </span>
      </div>

      <h3 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-3 line-clamp-2 leading-snug">
        {post.title}
      </h3>
      
      <p className="text-zinc-500 dark:text-zinc-400 line-clamp-3 mb-6 text-sm leading-relaxed flex-grow">
        {post.description}
      </p>

      <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-sm font-semibold text-zinc-600 dark:text-zinc-400">
        <span className="group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {t("home.readArticle")}
        </span>
        <ArrowIcon className="w-4 h-4 transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
      </div>
    </Link>
  );
}
