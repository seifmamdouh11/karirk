"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, MapPin, Briefcase, Grid, X, ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface FilterBarProps {
  filters: {
    q: string;
    category: string;
    type: string;
    country: string;
  };
  onChange: (newFilters: any) => void;
}

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const { locale, t } = useLanguage();

  const getCategoryName = (name: string) => {
    return name;
  };

  // Common Gulf/Arab countries from our taxonomy & seeds
  const countries = [
    { name: t("jobs.egypt"), value: "Egypt" },
    { name: t("jobs.saudiarabia"), value: "Saudi Arabia" },
    { name: t("jobs.unitedarabemirates"), value: "United Arab Emirates" },
    { name: t("jobs.jordan"), value: "Jordan" }
  ];

  const jobTypes = [
    { name: t("jobs.full-time"), value: "full-time" },
    { name: t("jobs.part-time"), value: "part-time" },
    { name: t("jobs.contract"), value: "contract" },
    { name: t("jobs.internship"), value: "internship" },
    { name: t("jobs.remote"), value: "remote" },
    { name: t("jobs.hybrid"), value: "hybrid" }
  ];

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await axios.get("/api/categories");
        if (res.data && res.data.success) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load categories in FilterBar:", err);
      } finally {
        setLoadingCats(false);
      }
    };
    fetchCats();
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, q: e.target.value });
  };

  const handleSelectChange = (field: string, value: string) => {
    onChange({ ...filters, [field]: value });
  };

  const clearFilters = () => {
    onChange({ q: "", category: "", type: "", country: "" });
  };

  const hasActiveFilters = filters.q || filters.category || filters.type || filters.country;

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-6 sm:p-7 shadow-lg shadow-zinc-100/50 dark:shadow-none flex flex-col gap-6 transition-all duration-300">

      {/* Search Bar Input Container */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
        <input
          type="text"
          value={filters.q}
          onChange={handleTextChange}
          placeholder={t("jobs.searchPlaceholder")}
          className="w-full pl-12 pr-12 py-3.5 bg-zinc-50 dark:bg-zinc-850/40 border border-zinc-200/85 dark:border-zinc-800/60 rounded-2xl text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/5 transition-all duration-200 shadow-inner"
        />
        {filters.q && (
          <button
            onClick={() => handleSelectChange("q", "")}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-xl text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 transition-all"
            type="button"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 -mt-2">
        <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mr-1.5">
          {t("home.popularSearch")}
        </span>
        <button
          onClick={() => handleSelectChange("type", filters.type === "remote" ? "" : "remote")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${filters.type === "remote"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 border-transparent text-white shadow-md shadow-blue-500/20"
              : "bg-zinc-50 dark:bg-zinc-850/40 border-zinc-200 dark:border-zinc-800/60 text-zinc-600 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
            }`}
          type="button"
        >
          {t("jobs.remoteOnly")}
        </button>
        <button
          onClick={() => handleSelectChange("country", filters.country === "Saudi Arabia" ? "" : "Saudi Arabia")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${filters.country === "Saudi Arabia"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 border-transparent text-white shadow-md shadow-blue-500/20"
              : "bg-zinc-50 dark:bg-zinc-850/40 border-zinc-200 dark:border-zinc-800/60 text-zinc-600 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
            }`}
          type="button"
        >
          {t("jobs.saudiArabiaBadge")}
        </button>
        <button
          onClick={() => handleSelectChange("country", filters.country === "United Arab Emirates" ? "" : "United Arab Emirates")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${filters.country === "United Arab Emirates"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 border-transparent text-white shadow-md shadow-blue-500/20"
              : "bg-zinc-50 dark:bg-zinc-850/40 border-zinc-200 dark:border-zinc-800/60 text-zinc-600 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
            }`}
          type="button"
        >
          {t("jobs.uaeBadge")}
        </button>
        <button
          onClick={() => handleSelectChange("category", filters.category === "technology" ? "" : "technology")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${filters.category === "technology"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 border-transparent text-white shadow-md shadow-blue-500/20"
              : "bg-zinc-50 dark:bg-zinc-850/40 border-zinc-200 dark:border-zinc-800/60 text-zinc-600 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
            }`}
          type="button"
        >
          {t("nav.tech")}
        </button>
      </div>

      {/* Grid of Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Category Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            {t("jobs.industryLabel")}
          </label>
          <div className="relative group">
            <Grid className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400 pointer-events-none group-focus-within:text-blue-500 transition-colors" />
            <select
              value={filters.category}
              onChange={(e) => handleSelectChange("category", e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-zinc-50 dark:bg-zinc-850/30 border border-zinc-200 dark:border-zinc-800/60 rounded-xl text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/5 transition-all appearance-none cursor-pointer"
            >
              <option value="">{t("jobs.allCategories")}</option>
              {loadingCats ? (
                <option disabled>Loading...</option>
              ) : (
                categories.map((parent: any) => (
                  <optgroup key={parent._id} label={getCategoryName(parent.name)} className="bg-white dark:bg-zinc-900">
                    <option value={parent.slug}>{getCategoryName(parent.name)} (All)</option>
                    {parent.subcategories?.map((sub: any) => (
                      <option key={sub._id} value={sub.slug}>
                        {getCategoryName(sub.name)}
                      </option>
                    ))}
                  </optgroup>
                ))
              )}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none transition-transform group-focus-within:rotate-180" />
          </div>
        </div>

        {/* Job Type Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            {t("jobs.typeLabel")}
          </label>
          <div className="relative group">
            <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400 pointer-events-none group-focus-within:text-blue-500 transition-colors" />
            <select
              value={filters.type}
              onChange={(e) => handleSelectChange("type", e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-zinc-50 dark:bg-zinc-850/30 border border-zinc-200 dark:border-zinc-800/60 rounded-xl text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/5 transition-all appearance-none cursor-pointer"
            >
              <option value="">{t("jobs.allTypes")}</option>
              {jobTypes.map((type) => (
                <option key={type.value} value={type.value} className="bg-white dark:bg-zinc-900">
                  {type.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none transition-transform group-focus-within:rotate-180" />
          </div>
        </div>

        {/* Country Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            {t("jobs.locationLabel")}
          </label>
          <div className="relative group">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400 pointer-events-none group-focus-within:text-blue-500 transition-colors" />
            <select
              value={filters.country}
              onChange={(e) => handleSelectChange("country", e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-zinc-50 dark:bg-zinc-850/30 border border-zinc-200 dark:border-zinc-800/60 rounded-xl text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/5 transition-all appearance-none cursor-pointer"
            >
              <option value="">{t("jobs.allLocations")}</option>
              {countries.map((country) => (
                <option key={country.value} value={country.value} className="bg-white dark:bg-zinc-900">
                  {country.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none transition-transform group-focus-within:rotate-180" />
          </div>
        </div>
      </div>

      {/* Active Filter Badges & Clear Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-zinc-100 dark:border-zinc-800/50">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mr-1.5">
              {t("jobs.activeFilters")}:
            </span>

            {filters.q && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-955/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 animate-in zoom-in-95 duration-200">
                &ldquo;{filters.q}&rdquo;
                <button
                  onClick={() => handleSelectChange("q", "")}
                  className="hover:bg-blue-100 dark:hover:bg-blue-900/40 p-0.5 rounded-lg transition-colors"
                  aria-label="Remove search query"
                  type="button"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {filters.category && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-955/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 capitalize animate-in zoom-in-95 duration-200">
                {t("jobs.categoryFilter")}: {getCategoryName(filters.category.replace("-", " "))}
                <button
                  onClick={() => handleSelectChange("category", "")}
                  className="hover:bg-blue-100 dark:hover:bg-blue-900/40 p-0.5 rounded-lg transition-colors"
                  aria-label="Remove category filter"
                  type="button"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {filters.type && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-955/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 capitalize animate-in zoom-in-95 duration-200">
                {t("jobs.typeFilter")}: {filters.type.replace("-", " ")}
                <button
                  onClick={() => handleSelectChange("type", "")}
                  className="hover:bg-blue-100 dark:hover:bg-blue-900/40 p-0.5 rounded-lg transition-colors"
                  aria-label="Remove job type filter"
                  type="button"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {filters.country && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-955/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 animate-in zoom-in-95 duration-200">
                {t("jobs.countryFilter")}: {t(`jobs.${filters.country.toLowerCase().replace(/ /g, "")}`) || filters.country}
                <button
                  onClick={() => handleSelectChange("country", "")}
                  className="hover:bg-blue-100 dark:hover:bg-blue-900/40 p-0.5 rounded-lg transition-colors"
                  aria-label="Remove location filter"
                  type="button"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
          </div>

          <button
            onClick={clearFilters}
            className="text-xs font-bold text-zinc-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-955/20 px-3 py-1.5 rounded-xl transition-all"
            type="button"
          >
            {t("jobs.clearAll")}
          </button>
        </div>
      )}
    </div>
  );
}
