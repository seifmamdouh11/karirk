"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { 
  Key, Trash2, Edit, LayoutDashboard, Briefcase, FileText, 
  AlertCircle, Database, Activity, Plus, FileSpreadsheet, Lock, Unlock, ArrowUpRight, ArrowUp
} from "lucide-react";

export default function ManageDashboardClient({ initialJobs, initialPosts }: { initialJobs: any[], initialPosts: any[] }) {
  const [activeTab, setActiveTab] = useState<"jobs" | "posts">("jobs");
  const [jobs, setJobs] = useState(initialJobs);
  const [posts, setPosts] = useState(initialPosts);
  const [secret, setSecret] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // 2-step Delete Confirmation State
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmTimeout, setConfirmTimeout] = useState<any>(null);

  useEffect(() => {
    return () => {
      if (confirmTimeout) clearTimeout(confirmTimeout);
    };
  }, [confirmTimeout]);

  // Scroll to top state & listener
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Search & Filtering States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const uniqueCategories = Array.from(
    new Set([
      ...jobs.map((j) => j.category),
      ...posts.map((p) => p.category),
    ].filter(Boolean))
  );

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.company || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = 
      selectedCategory === "all" || job.category === selectedCategory;
    const matchesStatus = 
      selectedStatus === "all" || job.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = 
      selectedCategory === "all" || post.category === selectedCategory;
    const matchesStatus = 
      selectedStatus === "all" || post.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDeleteClick = (id: string, type: "jobs" | "posts") => {
    if (!secret) {
      setError("Please enter your Admin Secret Key first.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (confirmDeleteId === id) {
      handleDelete(id, type);
      setConfirmDeleteId(null);
      if (confirmTimeout) {
        clearTimeout(confirmTimeout);
        setConfirmTimeout(null);
      }
    } else {
      setConfirmDeleteId(id);
      if (confirmTimeout) {
        clearTimeout(confirmTimeout);
      }
      const timeout = setTimeout(() => {
        setConfirmDeleteId(null);
      }, 4000);
      setConfirmTimeout(timeout);
    }
  };

  const handleDelete = async (id: string, type: "jobs" | "posts") => {
    setIsDeleting(id);
    setError(null);

    try {
      const res = await axios.delete(`/api/admin/${type}/${id}`, {
        headers: {
          secret: secret,
        },
      });

      if (res.data.success || res.status === 200) {
        if (type === "jobs") {
          setJobs(jobs.filter(j => j._id !== id));
        } else {
          setPosts(posts.filter(p => p._id !== id));
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || "Failed to delete. Check your secret key.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsDeleting(null);
    }
  };

  const getCategoryBadge = (slug: string = "") => {
    const presets: Record<string, { bg: string; text: string; border: string; dot: string }> = {
      "technology": {
        bg: "bg-indigo-50/65",
        text: "text-indigo-600",
        border: "border-indigo-100/80",
        dot: "bg-indigo-500"
      },
      "software": {
        bg: "bg-indigo-50/65",
        text: "text-indigo-600",
        border: "border-indigo-100/80",
        dot: "bg-indigo-500"
      },
      "marketing": {
        bg: "bg-pink-50/65",
        text: "text-pink-600",
        border: "border-pink-100/80",
        dot: "bg-pink-500"
      },
      "design": {
        bg: "bg-pink-50/65",
        text: "text-pink-600",
        border: "border-pink-100/80",
        dot: "bg-pink-500"
      },
      "sales": {
        bg: "bg-amber-50/65",
        text: "text-amber-600",
        border: "border-amber-100/80",
        dot: "bg-amber-500"
      },
      "business": {
        bg: "bg-amber-50/65",
        text: "text-amber-600",
        border: "border-amber-100/80",
        dot: "bg-amber-500"
      },
      "hr": {
        bg: "bg-purple-50/65",
        text: "text-purple-600",
        border: "border-purple-100/80",
        dot: "bg-purple-500"
      },
      "recruitment": {
        bg: "bg-purple-50/65",
        text: "text-purple-600",
        border: "border-purple-100/80",
        dot: "bg-purple-500"
      }
    };

    const cleanSlug = slug.toLowerCase();
    const matchedKey = Object.keys(presets).find(key => cleanSlug.includes(key));
    const theme = matchedKey ? presets[matchedKey] : {
      bg: "bg-zinc-50/70",
      text: "text-zinc-600",
      border: "border-zinc-200/80",
      dot: "bg-zinc-400"
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${theme.bg} ${theme.text} ${theme.border}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${theme.dot}`} />
        {slug.replace("-", " ")}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Secret Control center */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-zinc-200/85 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl text-white shadow-lg shadow-indigo-600/20">
              <LayoutDashboard className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-zinc-900">Platform Control Center</h1>
              <p className="text-xs font-medium text-zinc-500 mt-0.5">Admin dashboard for data orchestration & telemetry monitor.</p>
            </div>
          </div>
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4 items-center">
            {/* Glass action buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Link 
                href="/admin/import" 
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all border border-indigo-100/50 cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Import Jobs
              </Link>
              <Link 
                href="/admin/posts/new" 
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-600/10 hover:shadow-lg hover:shadow-indigo-600/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Write Post
              </Link>
            </div>

            {/* Authorize Console */}
            <div className="relative w-full sm:w-64 group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                {secret ? (
                  <Unlock className="h-4 w-4 text-emerald-500 transition-colors" />
                ) : (
                  <Lock className="h-4 w-4 text-zinc-400 transition-colors" />
                )}
              </div>
              <input
                type="password"
                placeholder="Enter Admin Secret Key..."
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className={`w-full pl-10 pr-24 py-2.5 bg-zinc-50/50 border rounded-xl text-xs font-medium outline-none transition-all duration-300 ${
                  secret 
                    ? 'border-emerald-500/30 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10' 
                    : 'border-zinc-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10'
                }`}
              />
              <div className="absolute inset-y-1.5 right-1.5 flex items-center">
                <span className={`px-2 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-widest transition-all duration-300 border ${
                  secret 
                    ? 'bg-emerald-50/80 text-emerald-600 border-emerald-250' 
                    : 'bg-zinc-100 text-zinc-400 border-zinc-200'
                }`}>
                  {secret ? 'Authorized' : 'Locked'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex gap-3 text-rose-800 animate-in fade-in slide-in-from-top-4">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-semibold">{error}</p>
          </div>
        )}

        {/* Telemetry Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Total Jobs */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-sm flex items-center justify-between group hover:border-indigo-500/30 transition-all duration-300">
            <div className="space-y-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Total Jobs</span>
              <h3 className="text-3xl font-black text-zinc-900">{jobs.length}</h3>
              <p className="text-[10px] font-semibold text-zinc-500 flex items-center gap-1">
                <span>Available on system</span>
              </p>
            </div>
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-105 transition-transform">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Active Jobs */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-sm flex items-center justify-between group hover:border-emerald-500/30 transition-all duration-300">
            <div className="space-y-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Active Jobs</span>
              <h3 className="text-3xl font-black text-zinc-900">
                {jobs.filter(j => j.status === 'active').length}
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-bold text-emerald-600">Live & searchable</span>
              </div>
            </div>
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Articles */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-sm flex items-center justify-between group hover:border-violet-500/30 transition-all duration-300">
            <div className="space-y-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Total Articles</span>
              <h3 className="text-3xl font-black text-zinc-900">{posts.length}</h3>
              <p className="text-[10px] font-semibold text-zinc-500">Insights & Resources</p>
            </div>
            <div className="p-4 bg-violet-50 text-violet-600 rounded-2xl group-hover:scale-105 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Database Connection */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-sm flex items-center justify-between group hover:border-blue-500/30 transition-all duration-300">
            <div className="space-y-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">DB Server</span>
              <h3 className="text-xl font-black text-zinc-900 flex items-center gap-1.5">
                Connected
              </h3>
              <p className="text-[10px] font-semibold text-zinc-500">Atlas Replica Set</p>
            </div>
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-105 transition-transform">
              <Database className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-zinc-100/60 p-1.5 rounded-2xl self-start inline-flex border border-zinc-200/50">
          <button
            onClick={() => { setActiveTab("jobs"); setSelectedStatus("all"); }}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
              activeTab === "jobs" 
                ? "bg-white text-indigo-600 shadow-md shadow-zinc-250/20" 
                : "text-zinc-500 hover:text-zinc-700 hover:bg-white/40"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Jobs ({jobs.length})
          </button>
          <button
            onClick={() => { setActiveTab("posts"); setSelectedStatus("all"); }}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
              activeTab === "posts" 
                ? "bg-white text-indigo-600 shadow-md shadow-zinc-250/20" 
                : "text-zinc-500 hover:text-zinc-700 hover:bg-white/40"
            }`}
          >
            <FileText className="w-4 h-4" />
            Articles ({posts.length})
          </button>
        </div>

        {/* Search & Filtering Bar */}
        <div className="bg-white p-4 rounded-3xl border border-zinc-200/90 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm text-zinc-900 font-medium placeholder:text-zinc-400"
            />
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex-1 md:flex-initial px-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:border-indigo-500 outline-none transition-all text-xs font-bold text-zinc-700 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.replace("-", " ").toUpperCase()}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="flex-1 md:flex-initial px-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:border-indigo-500 outline-none transition-all text-xs font-bold text-zinc-700 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              {activeTab === "jobs" ? (
                <>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </>
              ) : (
                <>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </>
              )}
            </select>

            {/* Clear Filters Button */}
            {(searchQuery || selectedCategory !== "all" || selectedStatus !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedStatus("all");
                }}
                className="px-4 py-3 rounded-2xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all border border-rose-100 cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Data Grid Table */}
        <div className="bg-white border border-zinc-200/90 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-zinc-50/60 border-b border-zinc-200 text-zinc-400 uppercase tracking-widest text-[10px] font-bold">
                <tr>
                  <th className="px-8 py-5">Title</th>
                  <th className="px-8 py-5">Category</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-medium">
                {activeTab === "jobs" && filteredJobs.map((job) => (
                  <tr key={job._id} className="hover:bg-zinc-50/50 transition-colors group cursor-pointer">
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-zinc-900 group-hover:text-indigo-600 transition-colors">{job.title}</span>
                        <span className="text-[10px] font-bold text-zinc-400 mt-1">{job.company || "Direct Recruiter"}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      {getCategoryBadge(job.category)}
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                        job.status === "active" 
                          ? "bg-emerald-50/80 text-emerald-700 border-emerald-200/60" 
                          : "bg-zinc-100 text-zinc-600 border-zinc-200/60"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          job.status === "active" ? "bg-emerald-500 animate-pulse" : "bg-zinc-400"
                        }`}></span>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2.5">
                        <Link
                          href={`/admin/jobs/${job._id}/edit`}
                          className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50/80 rounded-xl transition-all border border-transparent hover:border-indigo-200 cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(job._id, "jobs");
                          }}
                          disabled={isDeleting === job._id}
                          className={`p-2 rounded-xl transition-all border flex items-center gap-1 cursor-pointer disabled:opacity-50 ${
                            confirmDeleteId === job._id
                              ? "text-white bg-rose-600 border-rose-600 hover:bg-rose-700 hover:border-rose-700"
                              : "text-zinc-400 hover:text-rose-600 hover:bg-rose-50/80 border-transparent hover:border-rose-200"
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                          {confirmDeleteId === job._id && (
                            <span className="text-[10px] font-black uppercase tracking-wider px-1">Confirm?</span>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {activeTab === "posts" && filteredPosts.map((post) => (
                  <tr key={post._id} className="hover:bg-zinc-50/50 transition-colors group cursor-pointer">
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-zinc-900 group-hover:text-indigo-600 transition-colors">{post.title}</span>
                        <span className="text-[10px] font-bold text-zinc-400 mt-1">Editorial Post</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      {getCategoryBadge(post.category)}
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                        post.status === "published" 
                          ? "bg-emerald-50/80 text-emerald-700 border-emerald-200/60" 
                          : "bg-amber-50/85 text-amber-700 border-amber-200/60"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          post.status === "published" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                        }`}></span>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2.5">
                        <Link
                          href={`/admin/posts/${post._id}/edit`}
                          className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50/80 rounded-xl transition-all border border-transparent hover:border-indigo-200 cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(post._id, "posts");
                          }}
                          disabled={isDeleting === post._id}
                          className={`p-2 rounded-xl transition-all border flex items-center gap-1 cursor-pointer disabled:opacity-50 ${
                            confirmDeleteId === post._id
                              ? "text-white bg-rose-600 border-rose-600 hover:bg-rose-700 hover:border-rose-700"
                              : "text-zinc-400 hover:text-rose-600 hover:bg-rose-50/80 border-transparent hover:border-rose-200"
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                          {confirmDeleteId === post._id && (
                            <span className="text-[10px] font-black uppercase tracking-wider px-1">Confirm?</span>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {(activeTab === "jobs" && filteredJobs.length === 0) || (activeTab === "posts" && filteredPosts.length === 0) ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-16 text-center text-sm font-semibold text-zinc-400">
                      <Briefcase className="w-8 h-8 text-zinc-300 mx-auto mb-3 opacity-60" />
                      No matching {activeTab} found. Try adjusting your search/filters.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Floating Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 p-3.5 rounded-full bg-white text-zinc-700 hover:text-indigo-600 border border-zinc-200 shadow-xl transition-all duration-300 transform cursor-pointer z-50 hover:scale-110 active:scale-95 ${
          showScrollTop 
            ? "opacity-100 translate-y-0 scale-100" 
            : "opacity-0 translate-y-4 scale-75 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5 stroke-[2.5]" />
      </button>
    </div>
  );
}
