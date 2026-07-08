"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import FeaturedJobs from "./FeaturedJobs";
import LatestPosts from "./LatestPosts";
import { ArrowRight, ArrowLeft } from "lucide-react";

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
              href={`/categories/${cat.slug}`}
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
          <div>
            <span>
              {locale === "ar" ? "إعلان / ممول" : "Sponsored / AD"}
            </span>
            <div>
              <div>
                {locale === "ar" ? "شريك مميز" : "Featured Partner"}
              </div>
              <h3>
                {locale === "ar"
                  ? "سرّع رحلة بحثك عن عمل مع العروض المميزة"
                  : "Accelerate Your Search with Premium Placements"}
              </h3>
              <p>
                {locale === "ar"
                  ? "أرسل سيرتك الذاتية مباشرة إلى مسؤولي التوظيف والموارد البشرية في السعودية والإمارات."
                  : "Get your CV pushed directly to top recruiters and HR managers in Saudi Arabia and the UAE."}
              </p>
            </div>
            <div>
              <a href="#">
                <span>{locale === "ar" ? "أنشئ حسابا مميزا" : "Build Premium Profile"}</span>
              </a>
            </div>
          </div>

          <div>
            <h3>{t("footer.explore")}</h3>
            <div>
              <div>
                <span>12K+</span>
                <span>{t("home.statsTalents")}</span>
              </div>
              <div>
                <span>450+</span>
                <span>{t("home.statsCompanies")}</span>
              </div>
              <div>
                <span>890+</span>
                <span>{t("home.statsJobs")}</span>
              </div>
              <div>
                <span>99.2%</span>
                <span>
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
