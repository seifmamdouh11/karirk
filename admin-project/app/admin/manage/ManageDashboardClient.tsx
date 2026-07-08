"use client";

import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Key, Trash2, Edit, LayoutDashboard, Briefcase, FileText, AlertCircle } from "lucide-react";

export default function ManageDashboardClient({ initialJobs, initialPosts }: { initialJobs: any[], initialPosts: any[] }) {
  const [activeTab, setActiveTab] = useState<"jobs" | "posts">("jobs");
  const [jobs, setJobs] = useState(initialJobs);
  const [posts, setPosts] = useState(initialPosts);
  const [secret, setSecret] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string, type: "jobs" | "posts") => {
    if (!secret) {
      setError("Please enter your Admin Secret Key first.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!confirm(`Are you sure you want to delete this ${type === "jobs" ? "job" : "post"}?`)) {
      return;
    }

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

  return (
    <div className="min-h-screen bg-zinc-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Secret Input */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-600/20">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Platform Management</h1>
              <p className="text-sm text-zinc-500">Edit and remove jobs and posts.</p>
            </div>
          </div>
          
          <div className="w-full md:w-auto flex flex-col md:flex-row gap-4 items-center">
            <Link href="/admin/import" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Import Jobs &rarr;</Link>
            <Link href="/admin/posts/new" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Write Post &rarr;</Link>
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-4 w-4 text-zinc-400" />
              </div>
              <input
                type="password"
                placeholder="Enter Admin Secret..."
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm outline-none bg-zinc-50"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex gap-3 text-red-800 animate-in fade-in slide-in-from-top-4">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 border-b border-zinc-200">
          <button
            onClick={() => setActiveTab("jobs")}
            className={`pb-4 px-2 font-semibold text-sm flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "jobs" ? "border-indigo-600 text-indigo-600" : "border-transparent text-zinc-500 hover:text-zinc-700"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Jobs ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab("posts")}
            className={`pb-4 px-2 font-semibold text-sm flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "posts" ? "border-indigo-600 text-indigo-600" : "border-transparent text-zinc-500 hover:text-zinc-700"
            }`}
          >
            <FileText className="w-4 h-4" />
            Posts ({posts.length})
          </button>
        </div>

        {/* Content Table */}
        <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-zinc-50/50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {activeTab === "jobs" && jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-900">{job.title}</td>
                    <td className="px-6 py-4 text-zinc-500">{job.category}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${job.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-zinc-100 text-zinc-800"}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-3">
                      <Link
                        href={`/admin/jobs/${job._id}/edit`}
                        className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(job._id, "jobs")}
                        disabled={isDeleting === job._id}
                        className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                
                {activeTab === "posts" && posts.map((post) => (
                  <tr key={post._id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-900">{post.title}</td>
                    <td className="px-6 py-4 text-zinc-500">{post.category}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${post.status === "published" ? "bg-emerald-100 text-emerald-800" : "bg-yellow-100 text-yellow-800"}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-3">
                      <Link
                        href={`/admin/posts/${post._id}/edit`}
                        className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post._id, "posts")}
                        disabled={isDeleting === post._id}
                        className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                
                {(activeTab === "jobs" && jobs.length === 0) || (activeTab === "posts" && posts.length === 0) ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                      No {activeTab} found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
