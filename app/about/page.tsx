"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { Building2, Users, Globe2, Target, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const { locale, t } = useLanguage();
  const isRtl = locale === "ar";

  const [stats, setStats] = useState({
    jobsCount: "890+",
    companiesCount: "450+",
    talentsCount: "12K+",
    countriesCount: "4+"
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
            countriesCount: "4+"
          });
        }
      })
      .catch(err => console.error("Failed to load statistics:", err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-24">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto space-y-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
        
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium text-sm border border-indigo-100 dark:border-indigo-500/20">
          <Sparkles className="w-4 h-4 me-2 inline-block" />
          {isRtl ? "من نحن" : "Who We Are"}
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">
          {t("about.title")}
        </h1>
        
        <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
          {t("about.description")}
        </p>
      </div>

      {/* Stats/Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Users, label: isRtl ? "مرشحين موثقين" : "Verified Candidates", value: stats.talentsCount },
          { icon: Building2, label: isRtl ? "شركات توظيف" : "Hiring Companies", value: stats.companiesCount },
          { icon: Target, label: isRtl ? "فرص وظيفية" : "Career Opportunities", value: stats.jobsCount },
          { icon: Globe2, label: isRtl ? "دول مدعومة" : "Countries Supported", value: stats.countriesCount },
        ].map((stat, i) => (
          <div key={i} className="flex flex-col items-center text-center p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
              <stat.icon className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-2">{stat.value}</h3>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="w-full bg-zinc-900 dark:bg-zinc-800/50 rounded-[2.5rem] p-10 md:p-20 text-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-500/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            {isRtl ? "هل أنت مستعد لتطوير مسيرتك المهنية؟" : "Ready to advance your career?"}
          </h2>
          <p className="text-xl text-zinc-400">
            {isRtl 
              ? "انضم إلى شبكة المواهب النخبوية في العالم العربي اليوم."
              : "Join the Arab world's elite talent network today."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/jobs" 
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-zinc-900 font-bold hover:bg-zinc-100 hover:scale-105 transition-all shadow-lg"
            >
              {isRtl ? "استكشف الوظائف" : "Explore Jobs"}
            </Link>
            <Link 
              href="/categories" 
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-zinc-800 text-white font-bold hover:bg-zinc-700 hover:scale-105 transition-all border border-zinc-700"
            >
              {isRtl ? "تصفح المجالات" : "Browse Industries"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
