"use client";

import React from "react";
import Link from "next/link";
import { Briefcase, Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200/50 dark:border-zinc-850 mt-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

        {/* Brand section */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-950 to-zinc-700 dark:from-white dark:to-zinc-300 tracking-tight">
              {t("nav.brand")}
            </span>
          </Link>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm">
            {t("footer.brandDesc")}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <a href="#" className="p-2 rounded-lg bg-zinc-100 hover:bg-blue-50 hover:text-blue-600 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-blue-400 transition-colors" aria-label="Twitter">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
            <a href="#" className="p-2 rounded-lg bg-zinc-100 hover:bg-blue-50 hover:text-blue-600 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-blue-400 transition-colors" aria-label="LinkedIn">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" /></svg>
            </a>
            <a href="#" className="p-2 rounded-lg bg-zinc-100 hover:bg-blue-50 hover:text-blue-600 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-blue-400 transition-colors" aria-label="GitHub">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
            </a>
          </div>
        </div>

        {/* Resources / Links */}
        <div>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 uppercase tracking-wider">
            {t("footer.resources")}
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/jobs" className="text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {t("footer.browseJobs")}
              </Link>
            </li>
            <li>
              <Link href="/jobs?type=remote" className="text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {t("footer.remoteJobs")}
              </Link>
            </li>
            <li>
              <Link href="/jobs?featured=true" className="text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {t("footer.featuredOpenings")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Explore */}
        <div>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 uppercase tracking-wider">
            {t("footer.explore")}
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/categories" className="text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {t("footer.jobCategories")}
              </Link>
            </li>
            <li>
              <Link href="/posts" className="text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {t("footer.careerArticles")}
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {t("footer.aboutPlatform")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-4 text-sm text-zinc-500 dark:text-zinc-400">
          <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
            {t("footer.contactUs")}
          </h4>
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
            <span>{t("footer.address")}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-zinc-400 shrink-0" />
            <a href="mailto:kariraak@proton.me" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              kariraak@proton.me
            </a>
          </div>
        </div>

      </div>

      {/* Bottom section */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-zinc-100 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
        <p>&copy; {currentYear} {t("nav.brand")}. {t("footer.rights")}</p>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
            {t("footer.privacy")}
          </a>
          <a href="#" className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
            {t("footer.terms")}
          </a>
        </div>
      </div>
    </footer>
  );
}
