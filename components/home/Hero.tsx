"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { Search, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const { locale, t } = useLanguage();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/jobs?q=${encodeURIComponent(keyword)}&l=${encodeURIComponent(location)}`;
  };

  const popularSearches = locale === "ar" ? [
    { name: "مهندس برمجيات", slug: "software-engineer" },
    { name: "مصمم منتجات", slug: "product-designer" },
    { name: "مسوق رقمي", slug: "digital-marketing" },
    { name: "محاسب", slug: "accounting" },
  ] : [
    { name: "Software Engineer", slug: "software-engineer" },
    { name: "Product Designer", slug: "product-designer" },
    { name: "Digital Marketer", slug: "digital-marketing" },
    { name: "Accountant", slug: "accounting" },
  ];

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden bg-white dark:bg-zinc-950">
      
      {/* Background Square Pattern */}
      <div 
        className="absolute inset-0 -z-10 h-full w-full opacity-[0.15] dark:opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #808080 1px, transparent 1px),
            linear-gradient(to bottom, #808080 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 0%, #000 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 0%, #000 60%, transparent 100%)'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center text-center relative z-10">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 text-sm font-medium mb-8 border border-indigo-100 dark:border-indigo-500/20 shadow-sm backdrop-blur-md">
          <Sparkles className="w-4 h-4" />
          <span>{t("home.heroBadge")}</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6 max-w-4xl leading-[1.15]">
          {t("home.heroTitleStart")}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500 mx-2">
            {t("home.heroTitleHighlight")}
          </span>
          {t("home.heroTitleEnd")}
        </h1>

        {/* Hero Subtitle */}
        <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-12 max-w-2xl leading-relaxed">
          {t("home.heroSubtitle")}
        </p>

        {/* Search Form */}
        <form 
          onSubmit={handleSearch} 
          className="relative flex flex-col md:flex-row items-center w-full max-w-4xl mx-auto bg-white dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-3xl md:rounded-full shadow-2xl dark:shadow-black/50 p-2 gap-2"
        >
          <div className="flex items-center w-full md:w-1/2 px-4 py-3 md:py-0 border-b md:border-b-0 md:border-r border-zinc-100 dark:border-zinc-800 transition-colors focus-within:bg-zinc-50 dark:focus-within:bg-zinc-800/50 rounded-2xl md:rounded-l-full md:rounded-r-none">
            <Search className="w-5 h-5 text-zinc-400 shrink-0" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={t("jobs.searchPlaceholder")}
              className="w-full bg-transparent border-none outline-none focus:ring-0 px-3 text-zinc-900 dark:text-white placeholder:text-zinc-500 font-medium"
            />
          </div>

          <div className="flex items-center w-full md:w-1/2 px-4 py-3 md:py-0 transition-colors focus-within:bg-zinc-50 dark:focus-within:bg-zinc-800/50 rounded-2xl md:rounded-none">
            <MapPin className="w-5 h-5 text-zinc-400 shrink-0" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={locale === "ar" ? "المدينة، الدولة، أو عمل عن بعد..." : "City, country, or Remote..."}
              className="w-full bg-transparent border-none outline-none focus:ring-0 px-3 text-zinc-900 dark:text-white placeholder:text-zinc-500 font-medium"
            />
          </div>

          <button 
            type="submit" 
            className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-2xl md:rounded-full font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-95 transition-all duration-300 shrink-0"
          >
            {t("home.searchBtn")}
          </button>
        </form>

        {/* Popular Searches */}
        <div className="mt-10 flex flex-col md:flex-row items-center gap-4 text-sm">
          <span className="text-zinc-500 dark:text-zinc-400 font-medium">{t("home.popularSearch")}</span>
          <div className="flex flex-wrap justify-center gap-2">
            {popularSearches.map((tag) => (
              <Link 
                key={tag.slug} 
                href={`/jobs?q=${encodeURIComponent(tag.name)}`}
                className="px-4 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-indigo-200 dark:hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
