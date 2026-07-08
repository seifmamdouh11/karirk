"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { ArrowLeft, ArrowRight, Briefcase, Grid, FolderOpen } from "lucide-react";

export default function CategoriesContent({ categories }: { categories: any[] }) {
  const { locale, t } = useLanguage();
  const isRtl = locale === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20">
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-96 h-96 bg-violet-500/10 dark:bg-violet-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center space-y-6">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium text-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Grid className="w-4 h-4 me-2 inline-block" />
            {isRtl ? "استكشف المجالات" : "Explore Industries"}
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-zinc-900 dark:text-white tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700">
            {t("home.categoriesTitle") || (isRtl ? "تصفح حسب المجال" : "Browse by Industry")}
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-zinc-600 dark:text-zinc-400 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {isRtl 
              ? "اكتشف الفرص المهنية في أبرز القطاعات والتخصصات الدقيقة المصممة لدفع مسيرتك المهنية للأمام." 
              : "Discover career opportunities across top sectors and specific subcategories tailored to accelerate your career."}
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, index) => (
            <div 
              key={cat._id} 
              className="group flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Link 
                href={`/categories/${cat.slug}`}
                className="relative p-6 lg:p-8 flex items-center justify-between bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-800/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5 transition-colors overflow-hidden"
              >
                {/* Background glow on hover */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors"></div>

                <div className="relative flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm border border-zinc-100 dark:border-zinc-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 group-hover:shadow-indigo-500/20 transition-all duration-300">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {cat.name}
                  </h2>
                </div>
                <ArrowIcon className="relative w-6 h-6 text-zinc-300 dark:text-zinc-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-all duration-300" />
              </Link>
              
              <div className="p-6 lg:p-8 pt-0 lg:pt-0 flex-1 bg-white dark:bg-zinc-900">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent mb-6"></div>
                
                {cat.subcategories && cat.subcategories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {cat.subcategories.map((sub: any) => (
                      <Link 
                        key={sub._id}
                        href={`/categories/${sub.slug}`}
                        className="inline-flex items-center px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800/80 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-6 text-zinc-400 dark:text-zinc-500">
                    <FolderOpen className="w-5 h-5 me-2 opacity-50" />
                    <span className="text-sm font-medium">
                      {isRtl ? "تصفح جميع وظائف القسم" : "Explore all roles in this category"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
