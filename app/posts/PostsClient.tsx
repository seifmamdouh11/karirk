"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import PostGrid from "@/components/posts/PostGrid";
import { Search, X, Filter } from "lucide-react";

import { useLanguage } from "@/lib/LanguageContext";

export default function PostsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  const initialQ = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "";

  const [q, setQ] = useState(initialQ);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getCategoryName = (name: string) => {
    return name;
  };

  useEffect(() => {
    setQ(searchParams.get("q") || "");
    setSelectedCategory(searchParams.get("category") || "");
  }, [searchParams]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/categories");
        if (res.data && res.data.success) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load categories in posts page:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params: any = {};
        if (q) params.q = q;
        if (selectedCategory) params.category = selectedCategory;

        const res = await axios.get("/api/posts", { params });
        if (res.data && res.data.success) {
          setPosts(res.data.data);
        } else {
          setPosts([]);
        }
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchPosts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [q, selectedCategory]);

  const handleSearchChange = (val: string) => {
    setQ(val);
    updateUrlParams(val, selectedCategory);
  };

  const handleCategorySelect = (categorySlug: string) => {
    const newCat = selectedCategory === categorySlug ? "" : categorySlug;
    setSelectedCategory(newCat);
    updateUrlParams(q, newCat);
  };

  const updateUrlParams = (searchQuery: string, catSlug: string) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (catSlug) params.set("category", catSlug);
    router.push(`/posts?${params.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium text-sm">
          {t("posts.discover")}
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          {t("posts.title")}
        </h1>
        <p className="text-lg text-zinc-500 dark:text-zinc-400">
          {t("posts.subtitle")}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar / Filters */}
        <div className="w-full lg:w-80 shrink-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xl shadow-zinc-200/20 dark:shadow-black/20 space-y-8">
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute top-1/2 -translate-y-1/2 start-4 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                value={q}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={t("posts.searchPlaceholder")}
                className="w-full ps-12 pe-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 font-medium"
              />
              {q && (
                <button 
                  onClick={() => handleSearchChange("")}
                  className="absolute top-1/2 -translate-y-1/2 end-3 p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              <Filter className="w-4 h-4 text-zinc-400" />
              {t("jobs.industryLabel") || "Categories"}
            </label>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => handleCategorySelect("")}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors text-start ${
                  selectedCategory === "" 
                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" 
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                }`}
              >
                {t("posts.all") || "All Categories"}
              </button>
              {categories.map((cat: any) => (
                <button 
                  key={cat._id} 
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors text-start ${
                    selectedCategory === cat.slug 
                      ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" 
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  {getCategoryName(cat.name)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 w-full min-h-[400px]">
          <PostGrid posts={posts} loading={loading} />
        </div>
      </div>
    </div>
  );
}
