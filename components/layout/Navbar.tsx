"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import {
    Search,
    Menu,
    X,
    ChevronDown,
    Globe,
    Plus,
    Briefcase,
    Grid,
    FileText,
    Info,
    User,
    Sparkles,
    ArrowRight
} from "lucide-react";

import { useLanguage } from "@/lib/LanguageContext";

const getCategoryIcon = (slug: string) => {
    if (slug.includes("tech")) return <Sparkles className="w-4 h-4" />;
    if (slug.includes("design") || slug.includes("creative")) return <Grid className="w-4 h-4" />;
    if (slug.includes("market") || slug.includes("sales")) return <ArrowRight className="w-4 h-4 rotate-45" />;
    if (slug.includes("finance") || slug.includes("admin")) return <FileText className="w-4 h-4" />;
    if (slug.includes("legal") || slug.includes("law")) return <Info className="w-4 h-4" />;
    return <Briefcase className="w-4 h-4" />;
};

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<"jobs" | "categories" | null>(null);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const { locale, setLocale, t: translate } = useLanguage();
    const [scrolled, setScrolled] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [activeParent, setActiveParent] = useState<string | null>(null);

    // Live search states
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<{ jobs: any[]; posts: any[] } | null>(null);
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    // Clear search query and results on navigation
    useEffect(() => {
        setSearchQuery("");
        setSearchResults(null);
        setShowSearchResults(false);
        setIsSearchExpanded(false);
    }, [pathname]);

    // Fetch hierarchical categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get("/api/categories");
                if (res.data && res.data.success) {
                    setCategories(res.data.data);
                    if (res.data.data.length > 0) {
                        setActiveParent(res.data.data[0].slug);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            }
        };
        fetchCategories();
    }, []);

    // Monitor scroll for glassmorphism styling
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close dropdowns on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setShowSearchResults(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Debounced search query effect
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults(null);
            setShowSearchResults(false);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setIsSearchLoading(true);
            setShowSearchResults(true);
            try {
                const res = await axios.get(`/api/search?q=${encodeURIComponent(searchQuery)}`);
                if (res.data && res.data.success) {
                    setSearchResults({
                        jobs: res.data.jobs || [],
                        posts: res.data.posts || [],
                    });
                }
            } catch (err) {
                console.error("Live search failed:", err);
            } finally {
                setIsSearchLoading(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    // Focus search input when expanded
    useEffect(() => {
        if (isSearchExpanded && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchExpanded]);

    const toggleLocale = () => {
        setLocale(locale === "en" ? "ar" : "en");
    };

    const t = {
        brand: translate("nav.brand"),
        jobs: translate("nav.jobs"),
        categories: translate("nav.categories"),
        posts: translate("nav.posts"),
        about: translate("nav.about"),
        login: translate("nav.login"),
        postJob: translate("nav.postJob"),
        searchPlaceholder: translate("nav.searchPlaceholder"),
        allJobs: translate("nav.allJobs"),
        remoteJobs: translate("nav.remoteJobs"),
        featuredJobs: translate("nav.featuredJobs"),
        internships: translate("nav.internships"),
        tech: translate("nav.tech"),
        design: translate("nav.design"),
        marketing: translate("nav.marketing"),
        finance: translate("nav.finance"),
        techDesc: translate("nav.techDesc"),
        designDesc: translate("nav.designDesc"),
        marketingDesc: translate("nav.marketingDesc"),
        financeDesc: translate("nav.financeDesc"),
    };

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled
                    ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50 shadow-sm"
                    : "bg-white dark:bg-zinc-950 border-b border-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo & Main Nav Items */}
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
                                <Briefcase className="w-5 h-5" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-950 to-zinc-700 dark:from-white dark:to-zinc-300 tracking-tight">
                                {t.brand}
                            </span>
                        </Link>

                        {/* Desktop Navigation Links */}
                        <nav className="hidden md:flex items-center gap-1" ref={dropdownRef}>
                            {/* Jobs Dropdown Trigger */}
                            <div className="relative">
                                <button
                                    onClick={() => setActiveDropdown(activeDropdown === "jobs" ? null : "jobs")}
                                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeDropdown === "jobs" || pathname.startsWith("/jobs")
                                            ? "text-blue-600 bg-blue-50/50 dark:bg-blue-950/30 dark:text-blue-400"
                                            : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30"
                                        }`}
                                >
                                    <Briefcase className="w-4 h-4" />
                                    <span>{t.jobs}</span>
                                    <ChevronDown
                                        className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === "jobs" ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>

                                {/* Jobs Dropdown Menu */}
                                {activeDropdown === "jobs" && (
                                    <div className="absolute top-full start-0 mt-2 w-56 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 shadow-xl py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <Link
                                            href="/jobs"
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                            onClick={() => setActiveDropdown(null)}
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                            {t.allJobs}
                                        </Link>
                                        <Link
                                            href="/jobs?type=remote"
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-blue-600 transition-colors"
                                            onClick={() => setActiveDropdown(null)}
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                            {t.remoteJobs}
                                        </Link>
                                        <Link
                                            href="/jobs?featured=true"
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-blue-600 transition-colors"
                                            onClick={() => setActiveDropdown(null)}
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                                            {t.featuredJobs}
                                        </Link>
                                        <Link
                                            href="/jobs?type=internship"
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-blue-600 transition-colors"
                                            onClick={() => setActiveDropdown(null)}
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                            {t.internships}
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Categories Mega-Dropdown Trigger */}
                            <div className="relative">
                                <button
                                    onClick={() => setActiveDropdown(activeDropdown === "categories" ? null : "categories")}
                                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeDropdown === "categories" || pathname.startsWith("/categories")
                                            ? "text-blue-600 bg-blue-50/50 dark:bg-blue-950/30 dark:text-blue-400"
                                            : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30"
                                        }`}
                                >
                                    <Grid className="w-4 h-4" />
                                    <span>{t.categories}</span>
                                    <ChevronDown
                                        className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === "categories" ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>

                                {/* Categories Mega Menu Dropdown */}
                                {activeDropdown === "categories" && (
                                    <div className="absolute top-full start-0 mt-2 w-[540px] max-w-[90vw] rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 shadow-xl p-4 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                                        {categories.length === 0 ? (
                                            <div className="flex items-center justify-center py-8 text-zinc-400 text-sm">
                                                <span>Loading categories...</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-row divide-x divide-zinc-100 dark:divide-zinc-800 rtl:divide-x-reverse">
                                                {/* Left Panel: Parent Categories */}
                                                <div className="w-2/5 pe-3 flex flex-col gap-1 max-h-[300px] overflow-y-auto">
                                                    {categories.map((parent) => (
                                                        <button
                                                            key={parent._id}
                                                            onMouseEnter={() => setActiveParent(parent.slug)}
                                                            onClick={() => {
                                                                setActiveParent(parent.slug);
                                                            }}
                                                            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 text-start w-full ${activeParent === parent.slug
                                                                    ? "bg-blue-50/70 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400"
                                                                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                                                                }`}
                                                        >
                                                            <div className={`p-1.5 rounded-lg ${activeParent === parent.slug
                                                                    ? "bg-blue-100/50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                                                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                                                                }`}>
                                                                {getCategoryIcon(parent.slug)}
                                                            </div>
                                                            <span className="truncate">{parent.name}</span>
                                                        </button>
                                                    ))}
                                                </div>

                                                {/* Right Panel: Subcategories of the active parent */}
                                                <div className="w-3/5 ps-3 grid grid-cols-1 gap-1 max-h-[300px] overflow-y-auto">
                                                    {categories
                                                        .find((c) => c.slug === activeParent)
                                                        ?.subcategories.map((sub: any) => (
                                                            <Link
                                                                key={sub._id}
                                                                href={`/categories/${sub.slug}`}
                                                                className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/40 group transition-all"
                                                                onClick={() => setActiveDropdown(null)}
                                                            >
                                                                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                                    {sub.name}
                                                                </span>
                                                                <ArrowRight className="w-3 h-3 text-zinc-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-all" />
                                                            </Link>
                                                        ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Articles (Blog) Link */}
                            <Link
                                href="/posts"
                                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${pathname.startsWith("/posts")
                                        ? "text-blue-600 bg-blue-50/50 dark:bg-blue-950/30 dark:text-blue-400"
                                        : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30"
                                    }`}
                            >
                                <FileText className="w-4 h-4" />
                                <span>{t.posts}</span>
                            </Link>

                            {/* About Link */}
                            <Link
                                href="/about"
                                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${pathname.startsWith("/about")
                                        ? "text-blue-600 bg-blue-50/50 dark:bg-blue-950/30 dark:text-blue-400"
                                        : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30"
                                    }`}
                            >
                                <Info className="w-4 h-4" />
                                <span>{t.about}</span>
                            </Link>
                        </nav>
                    </div>

                    {/* Right Actions Block */}
                    <div className="flex items-center gap-3">
                        {/* Search Input Box */}
                        <div ref={searchContainerRef} className="relative flex items-center">
                            <div
                                className={`flex items-center rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden transition-all duration-300 ${isSearchExpanded ? "w-64 px-3" : "w-0 px-0"
                                    }`}
                            >
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        if (!isSearchExpanded) setIsSearchExpanded(true);
                                    }}
                                    onFocus={() => {
                                        if (searchQuery.trim()) setShowSearchResults(true);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && searchQuery.trim()) {
                                            setShowSearchResults(false);
                                            router.push(`/jobs?q=${encodeURIComponent(searchQuery)}`);
                                        }
                                    }}
                                    placeholder={t.searchPlaceholder}
                                    className="bg-transparent border-0 text-sm w-full py-1.5 focus:ring-0 focus:outline-none text-zinc-900 dark:text-white placeholder-zinc-400"
                                />
                            </div>
                            <button
                                onClick={() => {
                                    if (isSearchExpanded) {
                                        setSearchQuery("");
                                        setShowSearchResults(false);
                                        setIsSearchExpanded(false);
                                    } else {
                                        setIsSearchExpanded(true);
                                    }
                                }}
                                className="p-2 rounded-full text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-all"
                                aria-label="Search Toggle"
                            >
                                {isSearchExpanded ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                            </button>

                            {/* Live Search Results Dropdown */}
                            {showSearchResults && searchQuery.trim() && (
                                <div className="absolute top-full right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 shadow-2xl rounded-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {isSearchLoading ? (
                                        <div className="p-6 flex items-center justify-center gap-3 text-zinc-400 text-xs font-semibold">
                                            <div className="w-4 h-4 border-2 border-blue-600/25 border-t-blue-600 rounded-full animate-spin"></div>
                                            <span>{locale === "ar" ? "جاري البحث..." : "Searching..."}</span>
                                        </div>
                                    ) : (
                                        <div className="max-h-[350px] overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800">
                                            {/* Jobs Section */}
                                            {searchResults && searchResults.jobs.length > 0 && (
                                                <div className="p-3">
                                                    <h4 className="px-3 py-1.5 text-[10px] font-bold text-zinc-405 dark:text-zinc-500 uppercase tracking-widest">
                                                        {locale === "ar" ? "الوظائف المقترحة" : "Jobs Match"}
                                                    </h4>
                                                    <div className="mt-1 flex flex-col gap-0.5">
                                                        {searchResults.jobs.map((job) => (
                                                            <Link
                                                                key={job._id}
                                                                href={`/jobs/${job.slug || job._id}`}
                                                                onClick={() => setShowSearchResults(false)}
                                                                className="flex flex-col px-3 py-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                                                            >
                                                                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 line-clamp-1">
                                                                    {job.title}
                                                                </span>
                                                                <span className="text-[10px] text-zinc-400 font-medium mt-0.5">
                                                                    {job.company} &middot; {job.location}
                                                                </span>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Posts Section */}
                                            {searchResults && searchResults.posts.length > 0 && (
                                                <div className="p-3">
                                                    <h4 className="px-3 py-1.5 text-[10px] font-bold text-zinc-405 dark:text-zinc-500 uppercase tracking-widest">
                                                        {locale === "ar" ? "المقالات المقترحة" : "Articles Match"}
                                                    </h4>
                                                    <div className="mt-1 flex flex-col gap-0.5">
                                                        {searchResults.posts.map((post) => (
                                                            <Link
                                                                key={post._id}
                                                                href={`/posts/${post.slug || post._id}`}
                                                                onClick={() => setShowSearchResults(false)}
                                                                className="flex flex-col px-3 py-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                                                            >
                                                                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 line-clamp-1">
                                                                    {post.title}
                                                                </span>
                                                                <span className="text-[10px] text-zinc-400 font-medium mt-0.5 capitalize">
                                                                    {post.category.replace("-", " ")}
                                                                </span>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Empty State */}
                                            {searchResults && searchResults.jobs.length === 0 && searchResults.posts.length === 0 && (
                                                <div className="p-6 text-center text-zinc-400 text-xs font-medium">
                                                    {locale === "ar" ? "لا توجد نتائج مطابقة" : "No results match your query."}
                                                </div>
                                            )}

                                            {/* Footer CTA */}
                                            <div className="p-2 bg-zinc-50/50 dark:bg-zinc-900/50">
                                                <Link
                                                    href={`/jobs?q=${encodeURIComponent(searchQuery)}`}
                                                    onClick={() => setShowSearchResults(false)}
                                                    className="flex items-center justify-center gap-1.5 py-2 w-full text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 rounded-xl hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-all"
                                                >
                                                    <span>{locale === "ar" ? "عرض جميع نتائج الوظائف" : "Explore all matching jobs"}</span>
                                                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Language Toggle */}
                        <button
                            onClick={toggleLocale}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-600 dark:text-zinc-300 transition-all"
                        >
                            <Globe className="w-3.5 h-3.5" />
                            <span>{locale === "en" ? "العربية" : "English"}</span>
                        </button>



                        {/* Hamburger Button */}
                        <button
                            onClick={() => setIsOpen((prev) => !prev)}
                            className="p-2 rounded-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-850 hover:text-zinc-900 dark:hover:text-white md:hidden transition-all"
                            aria-label="Toggle Menu"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Drawer */}
            {isOpen && (
                <div className="md:hidden border-t border-zinc-200/50 dark:border-zinc-850 bg-white dark:bg-zinc-950 py-4 px-4 space-y-3 animate-in slide-in-from-top duration-300">
                    <div className="flex flex-col gap-2">
                        <Link
                            href="/jobs"
                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                            onClick={() => setIsOpen(false)}
                        >
                            <Briefcase className="w-4 h-4 text-zinc-400" />
                            <span>{t.jobs}</span>
                        </Link>
                        <Link
                            href="/categories"
                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                            onClick={() => setIsOpen(false)}
                        >
                            <Grid className="w-4 h-4 text-zinc-400" />
                            <span>{t.categories}</span>
                        </Link>
                        <Link
                            href="/posts"
                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                            onClick={() => setIsOpen(false)}
                        >
                            <FileText className="w-4 h-4 text-zinc-400" />
                            <span>{t.posts}</span>
                        </Link>
                        <Link
                            href="/about"
                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                            onClick={() => setIsOpen(false)}
                        >
                            <Info className="w-4 h-4 text-zinc-400" />
                            <span>{t.about}</span>
                        </Link>
                    </div>


                </div>
            )}
        </header>
    );
}
