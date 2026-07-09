"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import FeaturedJobs from "./FeaturedJobs";
import LatestPosts from "./LatestPosts";
import { ArrowRight, ArrowLeft, Sparkles, TrendingUp, Users, Building2, Briefcase, Percent } from "lucide-react";

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
  const isRtl = locale === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [stats, setStats] = useState({
    jobsCount: "890+",
    companiesCount: "450+",
    talentsCount: "12K+",
    matchQuality: "99.2%"
  });

  useEffect(() => {
    fetch("/api/stats")
      .then(res => res.json())
      .then(data => {
        if (data && data.success && data.data) {
          const d = data.data;
          setStats({
            jobsCount: d.jobsCount.toLocaleString(),
            companiesCount: d.companiesCount.toLocaleString(),
            talentsCount: d.talentsCount >= 1000 ? `${(d.talentsCount / 1000).toFixed(0)}K+` : d.talentsCount.toLocaleString(),
            matchQuality: d.matchQuality
          });
        }
      })
      .catch(err => console.error("Failed to load statistics:", err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-32">
      
      {/* Categories / Explore Industries Section */}
      <section className="w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-3">
              {t("home.categoriesTitle")}
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg">
              {isRtl ? "اكتشف الفرص المهنية في أبرز القطاعات" : "Discover career opportunities across top sectors"}
            </p>
          </div>
          <Link 
            href="/categories" 
            className="group flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            <span>{isRtl ? "عرض كل المجالات" : "View all industries"}</span>
            <ArrowIcon className="w-4 h-4 transform group-hover:scale-110 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {parentCategories.map((cat: any) => (
            <Link 
              key={cat._id.toString()} 
              href={`/categories/${cat.slug || cat._id}`}
              className="group relative flex items-center justify-between p-6 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300"
            >
              <span className="text-lg font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {cat.name}
              </span>
              <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                <ArrowIcon className="w-5 h-5 transform group-hover:scale-110 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Main Content (Jobs, Posts, Sidebar) */}
      <section className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-24">
          <FeaturedJobs jobs={serializedJobs} />
          <LatestPosts posts={serializedPosts} />
        </div>

        <aside className="w-full lg:w-[380px] shrink-0 space-y-8">
          {/* Card 1: Premium Placements Ad */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-zinc-950 via-indigo-950 to-purple-950 text-white rounded-3xl p-8 border border-indigo-500/20 dark:border-indigo-500/30 hover:border-indigo-500/40 shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300">
            {/* Background elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-indigo-500/30 transition-all duration-500"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-purple-500/30 transition-all duration-500"></div>
            
            {/* Shiny Grid pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none opacity-40"></div>
            
            <div className="relative space-y-6">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 backdrop-blur-md text-[10px] font-extrabold uppercase tracking-wider text-indigo-300 border border-indigo-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"></span>
                  {locale === "ar" ? "إعلان / ممول" : "Sponsored / AD"}
                </span>
                <Sparkles className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>

              <div className="space-y-3">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest block">
                  {locale === "ar" ? "شريك مميز" : "Featured Partner"}
                </span>
                <h3 className="text-xl font-extrabold leading-snug tracking-tight bg-gradient-to-r from-white via-zinc-100 to-indigo-200 bg-clip-text text-transparent">
                  {locale === "ar"
                    ? "سرّع رحلة بحثك عن عمل مع العروض المميزة"
                    : "Accelerate Your Search with Premium Placements"}
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed font-medium">
                  {locale === "ar"
                    ? "أرسل سيرتك الذاتية مباشرة إلى مسؤولي التوظيف والموارد البشرية في السعودية والإمارات."
                    : "Get your CV pushed directly to top recruiters and HR managers in Saudi Arabia and the UAE."}
                </p>
              </div>

              <a 
                href="#"
                className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                <span>{locale === "ar" ? "أنشئ حسابا مميزا" : "Build Premium Profile"}</span>
                <ArrowIcon className="w-4 h-4 transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Card 2: explore statistics */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                {t("footer.explore") || (locale === "ar" ? "استكشف" : "Explore")}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-50 dark:bg-zinc-800/30 p-4 rounded-2xl border border-zinc-100/80 dark:border-zinc-800/60 hover:border-indigo-500/20 transition-all duration-300">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1.5">
                  <Users className="w-4 h-4" />
                  <span className="text-xl font-black">{stats.talentsCount}</span>
                </div>
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block leading-tight">
                  {t("home.statsTalents")}
                </span>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-800/30 p-4 rounded-2xl border border-zinc-100/80 dark:border-zinc-800/60 hover:border-indigo-500/20 transition-all duration-300">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1.5">
                  <Building2 className="w-4 h-4" />
                  <span className="text-xl font-black">{stats.companiesCount}</span>
                </div>
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block leading-tight">
                  {t("home.statsCompanies")}
                </span>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-800/30 p-4 rounded-2xl border border-zinc-100/80 dark:border-zinc-800/60 hover:border-indigo-500/20 transition-all duration-300">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1.5">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-xl font-black">{stats.jobsCount}</span>
                </div>
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block leading-tight">
                  {t("home.statsJobs")}
                </span>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-800/30 p-4 rounded-2xl border border-zinc-100/80 dark:border-zinc-800/60 hover:border-indigo-500/20 transition-all duration-300">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1.5">
                  <Percent className="w-4 h-4" />
                  <span className="text-xl font-black">{stats.matchQuality}</span>
                </div>
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block leading-tight">
                  {locale === "ar" ? "جودة التوافق" : "Match Quality"}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
