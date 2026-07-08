"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLanguage } from "@/lib/LanguageContext";
import { Search, X, SlidersHorizontal, MapPin, Briefcase, Filter } from "lucide-react";

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
  const { t } = useLanguage();

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

  const activeFilterCount = Object.values(filters).filter(val => val !== "").length;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xl shadow-zinc-200/20 dark:shadow-black/20">
      
      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute top-1/2 -translate-y-1/2 start-4 w-5 h-5 text-zinc-400" />
        <input
          type="text"
          value={filters.q}
          onChange={handleTextChange}
          placeholder={t("jobs.searchPlaceholder")}
          className="w-full ps-12 pe-4 py-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 font-medium"
        />
        {filters.q && (
          <button 
            onClick={() => handleSelectChange("q", "")}
            className="absolute top-1/2 -translate-y-1/2 end-4 p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 me-2">
          <SlidersHorizontal className="w-4 h-4" />
          <span>{t("jobs.quickFilters") || "Quick Filters"}</span>
        </div>
        
        <button
          onClick={() => handleSelectChange("type", filters.type === "remote" ? "" : "remote")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filters.type === "remote" 
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" 
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
          }`}
        >
          {t("jobs.remoteOnly")}
        </button>
        
        <button
          onClick={() => handleSelectChange("country", filters.country === "Saudi Arabia" ? "" : "Saudi Arabia")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filters.country === "Saudi Arabia" 
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" 
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
          }`}
        >
          {t("jobs.saudiArabiaBadge")}
        </button>
        
        <button
          onClick={() => handleSelectChange("country", filters.country === "United Arab Emirates" ? "" : "United Arab Emirates")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filters.country === "United Arab Emirates" 
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" 
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
          }`}
        >
          {t("jobs.uaeBadge")}
        </button>
      </div>

      {/* Select Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 ms-1">
            <Filter className="w-4 h-4 text-zinc-400" />
            {t("jobs.industryLabel")}
          </label>
          <div className="relative">
            <select
              value={filters.category}
              onChange={(e) => handleSelectChange("category", e.target.value)}
              className="w-full appearance-none px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-zinc-700 dark:text-zinc-300 font-medium outline-none transition-colors"
            >
              <option value="">{t("jobs.allCategories")}</option>
              {loadingCats ? (
                <option disabled>Loading...</option>
              ) : (
                categories.map((parent: any) => (
                  <optgroup key={parent._id} label={parent.name}>
                    <option value={parent.slug}>{parent.name} (All)</option>
                    {parent.subcategories?.map((sub: any) => (
                      <option key={sub._id} value={sub.slug}>
                        {sub.name}
                      </option>
                    ))}
                  </optgroup>
                ))
              )}
            </select>
            <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center px-4 text-zinc-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 ms-1">
            <Briefcase className="w-4 h-4 text-zinc-400" />
            {t("jobs.typeLabel")}
          </label>
          <div className="relative">
            <select
              value={filters.type}
              onChange={(e) => handleSelectChange("type", e.target.value)}
              className="w-full appearance-none px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-zinc-700 dark:text-zinc-300 font-medium outline-none transition-colors"
            >
              <option value="">{t("jobs.allTypes")}</option>
              {jobTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center px-4 text-zinc-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 ms-1">
            <MapPin className="w-4 h-4 text-zinc-400" />
            {t("jobs.locationLabel")}
          </label>
          <div className="relative">
            <select
              value={filters.country}
              onChange={(e) => handleSelectChange("country", e.target.value)}
              className="w-full appearance-none px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-zinc-700 dark:text-zinc-300 font-medium outline-none transition-colors"
            >
              <option value="">{t("jobs.allLocations")}</option>
              {countries.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center px-4 text-zinc-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      {activeFilterCount > 0 && (
        <div className="mt-6 flex justify-end">
          <button 
            onClick={clearFilters} 
            type="button"
            className="flex items-center gap-1.5 text-sm font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 px-4 py-2 rounded-xl transition-colors"
          >
            <X className="w-4 h-4" />
            {t("jobs.clearAll")}
          </button>
        </div>
      )}
    </div>
  );
}
