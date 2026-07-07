"use client";

import React, { useState } from "react";
import { Search, MapPin, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

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
    { name: "محاسب", slug: "accounting" }
  ] : [
    { name: "Software Engineer", slug: "software-engineer" },
    { name: "Product Designer", slug: "product-designer" },
    { name: "Digital Marketer", slug: "digital-marketing" },
    { name: "Accountant", slug: "accounting" }
  ];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-zinc-50 dark:from-zinc-950/20 dark:via-zinc-950 dark:to-zinc-950 border-b border-zinc-200/50 dark:border-zinc-800/40 py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
      {/* Background decoration blur */}
      <div className="absolute top-[-20%] start-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-blue-500/10 rounded-full blur-3xl -z-10 animate-pulse duration-[6000ms]"></div>
      <div className="absolute bottom-[-10%] end-[-5%] w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-blue-500/10 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Banner highlight */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-6 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t("home.heroBadge")}</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-700 dark:from-white dark:via-zinc-100 dark:to-zinc-400 max-w-3xl leading-[1.15] sm:leading-[1.1] mb-6">
          {t("home.heroTitleStart")}
          <span className="text-blue-600 dark:text-blue-400">{t("home.heroTitleHighlight")}</span>
          {t("home.heroTitleEnd")}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mb-10 font-medium">
          {t("home.heroSubtitle")}
        </p>

        {/* Search Bar Form */}
        <form
          onSubmit={handleSearch}
          className="w-full max-w-4xl bg-white/95 dark:bg-zinc-950/95 border border-zinc-200/80 dark:border-zinc-800/80 rounded-4xl shadow-[0_35px_80px_-50px_rgba(15,23,42,0.2)] backdrop-blur-xl p-2.5 sm:p-3 flex flex-col md:flex-row items-stretch gap-2.5"
        >
          {/* Keyword Search */}
          <div className="flex-1 flex items-center gap-2.5 px-3 min-w-0 border-b md:border-b-0 md:border-e border-zinc-100 dark:border-zinc-800 pb-2 md:pb-0">
            <Search className="w-5 h-5 text-zinc-400 shrink-0" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={t("jobs.searchPlaceholder")}
              className="bg-transparent border-0 text-sm w-full py-2.5 focus:ring-0 focus:outline-none text-zinc-900 dark:text-white placeholder-zinc-400"
            />
          </div>

          {/* Location Search */}
          <div className="flex-1 flex items-center gap-2.5 px-3 min-w-0 pb-2 md:pb-0">
            <MapPin className="w-5 h-5 text-zinc-400 shrink-0" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={locale === "ar" ? "المدينة، الدولة، أو عمل عن بعد..." : "City, country, or Remote..."}
              className="bg-transparent border-0 text-sm w-full py-2.5 focus:ring-0 focus:outline-none text-zinc-900 dark:text-white placeholder-zinc-400"
            />
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className="flex items-center justify-center px-8 py-3.5 bg-blue-600 hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/20 active:scale-98 transition-all duration-200 shrink-0"
          >
            {t("home.searchBtn")}
          </button>
        </form>

        {/* Popular Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6 text-xs text-blue-700">
          <span className="font-semibold">{t("home.popularSearch")}</span>
          {popularSearches.map((tag) => (
            <a
              key={tag.slug}
              href={`/jobs?q=${encodeURIComponent(tag.name)}`}
              className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100 transition-colors"
            >
              {tag.name}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
