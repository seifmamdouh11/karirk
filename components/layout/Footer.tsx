"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { Briefcase, Mail, MapPin, MessageSquare, Globe, Code } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & Description */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-300 tracking-tight">
                {t("nav.brand")}
              </span>
            </Link>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-sm">
              {t("footer.brandDesc")}
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
                <MessageSquare className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
                <Code className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-6">
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">
              {t("footer.resources")}
            </h4>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/jobs" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {t("footer.browseJobs")}
                </Link>
              </li>
              <li>
                <Link href="/jobs?type=remote" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {t("footer.remoteJobs")}
                </Link>
              </li>
              <li>
                <Link href="/jobs?featured=true" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {t("footer.featuredOpenings")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Explore */}
          <div className="flex flex-col gap-6">
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">
              {t("footer.explore")}
            </h4>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/categories" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {t("footer.jobCategories")}
                </Link>
              </li>
              <li>
                <Link href="/posts" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {t("footer.careerArticles")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {t("footer.aboutPlatform")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="flex flex-col gap-6">
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">
              {t("footer.contactUs")}
            </h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                <MapPin className="w-4 h-4 mt-0.5 text-zinc-400 shrink-0" />
                <span>{t("footer.address")}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                <Mail className="w-4 h-4 text-zinc-400 shrink-0" />
                <a href="mailto:kariraak@proton.me" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  kariraak@proton.me
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            &copy; {currentYear} {t("nav.brand")}. {t("footer.rights")}
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              {t("footer.privacy")}
            </a>
            <a href="#" className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              {t("footer.terms")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
