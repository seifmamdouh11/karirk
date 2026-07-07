"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import PostGrid from "@/components/posts/PostGrid";
import { Search, Sparkles, BookOpen, X } from "lucide-react";

import { useLanguage } from "@/lib/LanguageContext";

function PostsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale, t } = useLanguage();

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

  // Sync state with URL search params changes
  useEffect(() => {
    setQ(searchParams.get("q") || "");
    setSelectedCategory(searchParams.get("category") || "");
  }, [searchParams]);

  // Fetch parent categories on mount
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

  // Fetch posts from API
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

    // Debounce the text query by 300ms
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-10">
      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>{t("posts.discover")}</span>
        </div>
        <h1 className="text-4xl font-extrabold font-display tracking-tight text-zinc-950 dark:text-white sm:text-5xl leading-none">
          {t("posts.title")}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
          {t("posts.subtitle")}
        </p>
      </div>

      {/* Filter and Search Bar Section */}
      <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm">
        {/* Search input */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={q}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={t("posts.searchPlaceholder")}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-850/50 border border-zinc-200 dark:border-zinc-800/60 rounded-xl text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
          {q && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-650"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills/Scroll strip */}
        <div className="w-full md:w-auto flex items-center gap-2 overflow-x-auto pb-2 md:pb-1 scrollbar-thin">
          <span className="text-xs font-semibold text-zinc-450 dark:text-zinc-500 uppercase shrink-0 mr-1">
            {t("jobs.industryLabel")}:
          </span>
          <button
            onClick={() => handleCategorySelect("")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              !selectedCategory
                ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                : "bg-zinc-50 dark:bg-zinc-850 text-zinc-650 dark:text-zinc-350 border-zinc-200 dark:border-zinc-800 hover:border-zinc-350"
            }`}
          >
            {t("posts.all")}
          </button>
          {categories.map((cat: any) => (
            <button
              key={cat._id}
              onClick={() => handleCategorySelect(cat.slug)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border shrink-0 transition-all ${
                selectedCategory === cat.slug
                  ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                  : "bg-zinc-50 dark:bg-zinc-850 text-zinc-650 dark:text-zinc-350 border-zinc-200 dark:border-zinc-800 hover:border-zinc-350"
              }`}
            >
              {getCategoryName(cat.name)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Post Grid Section */}
      <div className="w-full">
        <PostGrid posts={posts} loading={loading} />
      </div>
    </div>
  );
}

export default function PostsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center items-center">
          <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      }
    >
      <PostsContent />
    </Suspense>
  );
}
