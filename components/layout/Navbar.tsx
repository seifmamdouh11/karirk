"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useLanguage } from "@/lib/LanguageContext";
import { Search, Globe, Briefcase, Menu, X, ArrowRight } from "lucide-react";

export default function Navbar() {
    const router = useRouter();
    const { locale, setLocale, t: translate } = useLanguage();
    
    const [categories, setCategories] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<{ jobs: any[]; posts: any[] } | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    
    const searchContainerRef = useRef<HTMLDivElement>(null);

    // Close search results if clicked outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setSearchResults(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get("/api/categories");
                if (res.data && res.data.success) {
                    setCategories(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults(null);
            setIsSearchLoading(false);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setIsSearchLoading(true);
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

    const toggleLocale = () => {
        setLocale(locale === "en" ? "ar" : "en");
    };

    const t = {
        brand: translate("nav.brand"),
        home: translate("nav.home") || (locale === 'en' ? 'Home' : 'الرئيسية'),
        jobs: translate("nav.jobs"),
        categories: translate("nav.categories"),
        posts: translate("nav.posts"),
        about: translate("nav.about"),
    };

    const navLinks = [
        { href: "/", label: t.home },
        { href: "/jobs", label: t.jobs },
        { href: "/categories", label: t.categories },
        { href: "/posts", label: t.posts },
        { href: "/about", label: t.about },
    ];

    const handleSearchSubmit = () => {
        if (searchQuery.trim()) {
            router.push(`/jobs?q=${encodeURIComponent(searchQuery)}`);
            setSearchResults(null);
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex items-center justify-between h-16">
                    
                    {/* Brand */}
                    <div className="flex items-center flex-shrink-0">
                        <Link href="/" className="flex items-center gap-2 group" onClick={() => setIsMobileMenuOpen(false)}>
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                                <Briefcase className="w-4 h-4" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-300 tracking-tight">
                                {t.brand}
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1 rtl:space-x-reverse mx-8">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.href} 
                                href={link.href}
                                className="px-3.5 py-2 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-all duration-200"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4 relative">
                        {/* Search Bar */}
                        <div className="relative" ref={searchContainerRef}>
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                                    className="w-64 pl-9 pr-4 py-2 bg-zinc-100 dark:bg-zinc-900/50 border border-transparent focus:border-indigo-500/30 focus:bg-white dark:focus:bg-zinc-900 rounded-full text-sm text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300"
                                    placeholder={locale === 'en' ? "Search jobs or posts..." : "البحث عن وظائف ومقالات..."}
                                />
                            </div>

                            {/* Search Results Dropdown */}
                            {searchQuery.trim() && (
                                <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-none border border-zinc-200/60 dark:border-zinc-800/80 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                                    {isSearchLoading ? (
                                        <div className="p-4 flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
                                        </div>
                                    ) : searchResults ? (
                                        <div className="max-h-[350px] overflow-y-auto p-2 flex flex-col gap-1">
                                            {searchResults.jobs.length > 0 && (
                                                <div className="mb-2">
                                                    <span className="px-3 py-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{locale === 'en' ? 'Jobs' : 'الوظائف'}</span>
                                                    {searchResults.jobs.map(job => (
                                                        <Link 
                                                            key={job._id} 
                                                            href={`/jobs/${job.slug || job._id}`}
                                                            onClick={() => setSearchResults(null)}
                                                            className="flex items-center px-3 py-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group"
                                                        >
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-medium text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-1">{job.title}</span>
                                                                <span className="text-xs text-zinc-500">{job.company}</span>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                            {searchResults.posts.length > 0 && (
                                                <div>
                                                    <span className="px-3 py-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{locale === 'en' ? 'Articles' : 'المقالات'}</span>
                                                    {searchResults.posts.map(post => (
                                                        <Link 
                                                            key={post._id} 
                                                            href={`/posts/${post.slug || post._id}`}
                                                            onClick={() => setSearchResults(null)}
                                                            className="flex items-center px-3 py-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group"
                                                        >
                                                            <span className="text-sm font-medium text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-1">{post.title}</span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                            {searchResults.jobs.length === 0 && searchResults.posts.length === 0 && (
                                                <div className="p-4 text-center text-sm text-zinc-500">
                                                    {locale === 'en' ? 'No results found.' : 'لا توجد نتائج.'}
                                                </div>
                                            )}
                                        </div>
                                    ) : null}
                                </div>
                            )}
                        </div>

                        {/* Language Toggle */}
                        <button 
                            onClick={toggleLocale}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                        >
                            <Globe className="w-3.5 h-3.5" />
                            <span>{locale === "en" ? "العربية" : "EN"}</span>
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center gap-3 md:hidden">
                        <button 
                            onClick={toggleLocale}
                            className="p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                        >
                            <Globe className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 -mr-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </nav>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 pt-4 pb-6 space-y-4 shadow-xl">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                            className="w-full pl-9 pr-4 py-2.5 bg-zinc-100 dark:bg-zinc-900 border-transparent rounded-xl text-sm text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            placeholder={locale === 'en' ? "Search..." : "بحث..."}
                        />

                        {/* Mobile Live Search Results Dropdown */}
                        {searchQuery.trim() && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200/60 dark:border-zinc-800/80 overflow-hidden duration-200 z-50">
                                {isSearchLoading ? (
                                    <div className="p-4 flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
                                    </div>
                                ) : searchResults ? (
                                    <div className="max-h-[280px] overflow-y-auto p-2 flex flex-col gap-1">
                                        {searchResults.jobs.length > 0 && (
                                            <div className="mb-2">
                                                <span className="px-3 py-1.5 text-[10px] font-bold text-zinc-400 opacity-80 uppercase tracking-wider block text-start">{locale === 'en' ? 'Jobs' : 'الوظائف'}</span>
                                                {searchResults.jobs.map(job => (
                                                    <Link 
                                                        key={job._id} 
                                                        href={`/jobs/${job.slug || job._id}`}
                                                        onClick={() => { setSearchResults(null); setIsMobileMenuOpen(false); }}
                                                        className="flex items-center px-3 py-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group"
                                                    >
                                                        <div className="flex flex-col text-start">
                                                            <span className="text-sm font-medium text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-1">{job.title}</span>
                                                            <span className="text-xs text-zinc-500">{job.company}</span>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                        {searchResults.posts.length > 0 && (
                                            <div>
                                                <span className="px-3 py-1.5 text-[10px] font-bold text-zinc-400 opacity-80 uppercase tracking-wider block text-start">{locale === 'en' ? 'Articles' : 'المقالات'}</span>
                                                {searchResults.posts.map(post => (
                                                    <Link 
                                                        key={post._id} 
                                                        href={`/posts/${post.slug || post._id}`}
                                                        onClick={() => { setSearchResults(null); setIsMobileMenuOpen(false); }}
                                                        className="flex items-center px-3 py-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group"
                                                    >
                                                        <div className="flex flex-col text-start">
                                                            <span className="text-sm font-medium text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-1">{post.title}</span>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                        {searchResults.jobs.length === 0 && searchResults.posts.length === 0 && (
                                            <div className="p-4 text-center text-sm text-zinc-500">
                                                {locale === 'en' ? 'No results found.' : 'لا توجد نتائج.'}
                                            </div>
                                        )}
                                    </div>
                                ) : null}
                            </div>
                        )}
                    </div>
                    
                    <div className="flex flex-col space-y-1">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.href} 
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-indigo-600 dark:hover:text-indigo-400"
                            >
                                {link.label}
                                <ArrowRight className="w-4 h-4 rtl:rotate-180 opacity-50" />
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
}
