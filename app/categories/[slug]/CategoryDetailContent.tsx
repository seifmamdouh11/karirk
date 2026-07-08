"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import JobCard from "@/components/jobs/JobCard";
import { ChevronRight, ChevronLeft, Briefcase, SearchX, ArrowRight, ArrowLeft } from "lucide-react";

export default function CategoryDetailContent({ category, jobs }: { category: any, jobs: any[] }) {
  const { locale, t } = useLanguage();
  const isRtl = locale === "ar";
  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight;
  const BackArrowIcon = isRtl ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20">
      {/* Breadcrumbs & Navigation */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center text-sm font-medium text-zinc-500 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              {t("nav.home") || (isRtl ? "الرئيسية" : "Home")}
            </Link>
            <ChevronIcon className="w-4 h-4 mx-2 flex-shrink-0" />
            <Link href="/categories" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              {t("nav.categories") || (isRtl ? "التصنيفات" : "Categories")}
            </Link>
            <ChevronIcon className="w-4 h-4 mx-2 flex-shrink-0" />
            <span className="text-zinc-900 dark:text-zinc-100">{category.name}</span>
          </nav>
        </div>
      </div>

      {/* Premium Hero Section */}
      <div className="relative overflow-hidden bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-500/10 dark:bg-violet-500/20 rounded-full blur-3xl -translate-x-1/3 translate-y-1/2"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <Link 
              href="/categories" 
              className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-6 transition-colors"
            >
              <BackArrowIcon className="w-4 h-4 me-1.5" />
              {isRtl ? "العودة إلى جميع التصنيفات" : "Back to All Categories"}
            </Link>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-100 dark:border-indigo-500/20">
                <Briefcase className="w-8 h-8" />
              </div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold tracking-wider text-zinc-600 dark:text-zinc-300 uppercase">
                {isRtl ? "تصنيف الصناعة" : "Industry Category"}
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-4">
              {category.name} {isRtl ? "الوظائف" : "Jobs"}
            </h1>
            
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
              {isRtl 
                ? `تصفح الوظائف الشاغرة والمسارات المهنية في مجال ${category.name}. اكتشف الفرص التي تناسب طموحاتك.` 
                : `Browse open vacancies and career pathways in the ${category.name} industry. Discover opportunities that match your ambitions.`}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            {isRtl ? "الوظائف المتاحة" : "Open Positions"} 
            <span className="ms-3 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-sm rounded-full font-medium">
              {jobs.length}
            </span>
          </h2>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-12 text-center shadow-sm">
            <div className="w-20 h-20 mx-auto rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-6">
              <SearchX className="w-10 h-10 text-zinc-400 dark:text-zinc-500" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
              {t("categories.noJobsTitle") || (isRtl ? "لا توجد وظائف في هذا التصنيف" : "No Jobs in this Category")}
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-8">
              {t("categories.noJobsDesc") || (isRtl 
                ? `لا توجد حاليًا وظائف شاغرة مدرجة تحت تصنيف "${category.name}". يرجى التحقق مرة أخرى لاحقًا أو استكشاف خيارات مهنية أخرى.`
                : `There are currently no open positions listed under "${category.name}". Check back later or explore other career options.`)}
            </p>
            <Link 
              href="/jobs"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300"
            >
              {isRtl ? "استكشف جميع الوظائف" : "Explore All Jobs"}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job: any) => (
              <JobCard key={job._id.toString()} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
