"use client";

import React from "react";
import Link from "next/link";
import { Grid, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import FeaturedJobs from "./FeaturedJobs";
import LatestPosts from "./LatestPosts";

interface HomeContentProps {
  parentCategories: any[];
  serializedJobs: any[];
  serializedPosts: any[];
}

export default function HomeContent({
  parentCategories,
  serializedJobs,
  serializedPosts,
}: HomeContentProps) {
  const { locale, t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-16">
      
      {/* 2. Category Quick Strip */}
      <section className="w-full">
        <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          <Grid className="w-3.5 h-3.5" />
          <span>{t("home.categoriesTitle")}</span>
        </div>
        <div className="flex items-center gap-3 overflow-x-auto pb-3 scrollbar-thin scroll-smooth">
          {parentCategories.map((cat: any) => (
            <Link
              key={cat._id.toString()}
              href={`/categories/${cat.slug}`}
              className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-blue-100 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100 text-sm font-semibold text-blue-900 transition-all duration-200"
            >
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Main Content Grid (Two-Column: Left Main Content / Right Sidebar Ads & Info) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Main Area (8 Columns) */}
        <div className="lg:col-span-8 flex flex-col gap-12">

          {/* Featured Jobs */}
          <FeaturedJobs jobs={serializedJobs} />

          {/* Latest Articles */}
          <LatestPosts posts={serializedPosts} />

        </div>

        {/* Sidebar Area (4 Columns) */}
        <aside className="lg:col-span-4 flex flex-col gap-8">

          {/* AD ZONE B (Skyscraper Banner) */}
          <div className="w-full rounded-2xl bg-blue-50 border border-blue-100 p-6 flex flex-col justify-between min-h-[350px] relative overflow-hidden">
            <span className="absolute top-3 start-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              {locale === "ar" ? "إعلان / ممول" : "Sponsored / AD"}
            </span>

            <div className="mt-6">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold mb-3">
                {locale === "ar" ? "شريك متميز" : "Featured Partner"}
              </div>
              <h3 className="text-lg font-bold text-zinc-950 dark:text-white leading-snug">
                {locale === "ar" 
                  ? "سرّع عملية بحثك عن عمل مع خدمة العروض المميزة" 
                  : "Accelerate Your Search with Premium Placements"
                }
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                {locale === "ar"
                  ? "قم بإرسال سيرتك الذاتية مباشرة لمدراء التوظيف والموارد البشرية في السعودية والإمارات."
                  : "Get your CV pushed directly to top recruiters and HR managers in Saudi Arabia and the UAE."
                }
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-2">
              <a
                href="#"
                className="flex items-center justify-center gap-1.5 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all"
              >
                <span>{locale === "ar" ? "أنشئ حساباً مميزاً" : "Build Premium Profile"}</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </a>
            </div>
          </div>

          {/* Platform Stats Widget */}
          <div className="w-full rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 p-6">
            <h3 className="text-sm font-bold text-zinc-950 dark:text-white uppercase tracking-wider mb-4">
              {t("footer.explore")}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <span className="block text-2xl font-extrabold text-blue-700">12K+</span>
                <span className="text-[10px] font-semibold text-blue-500 uppercase">{t("home.statsTalents")}</span>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <span className="block text-2xl font-extrabold text-blue-700">450+</span>
                <span className="text-[10px] font-semibold text-blue-500 uppercase">{t("home.statsCompanies")}</span>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <span className="block text-2xl font-extrabold text-blue-700">890+</span>
                <span className="text-[10px] font-semibold text-blue-500 uppercase">{t("home.statsJobs")}</span>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <span className="block text-2xl font-extrabold text-blue-700">99.2%</span>
                <span className="text-[10px] font-semibold text-blue-500 uppercase">{locale === "ar" ? "نسبة التوافق" : "Match Quality"}</span>
              </div>
            </div>
          </div>

        </aside>

      </section>

    </div>
  );
}
