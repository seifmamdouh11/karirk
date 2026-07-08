"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { PenSquare, Save, AlertCircle, CheckCircle2, LayoutTemplate, Briefcase, Key } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EditPostClient({ initialPost }: { initialPost: any }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: initialPost.title || "",
    description: initialPost.description || "",
    category: initialPost.category || "",
    status: initialPost.status || "published",
    secret: "",
  });

  const [categories, setCategories] = useState<{ _id: string; name: string; slug: string; subcategories: any[] }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await axios.put(`/api/admin/posts/${initialPost._id}`, 
        {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          status: formData.status,
        },
        {
          headers: {
            secret: formData.secret,
          },
        }
      );

      if (res.data && res.data.success) {
        setSuccess(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.error || 
        err.response?.data?.message || 
        "Failed to update post. Please check your secret key and try again."
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsLoading(false);
    }
  };

  const flatCategories = categories.flatMap(parent => [
    { name: parent.name, slug: parent.slug, isParent: true },
    ...parent.subcategories.map(sub => ({ name: `— ${sub.name}`, slug: sub.slug, isParent: false }))
  ]);

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/20">
                <PenSquare className="w-6 h-6" />
              </div>
              Edit Article
            </h1>
            <p className="mt-2 text-zinc-500">Update the contents of this post.</p>
          </div>
          <Link 
            href="/admin/manage" 
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-lg transition-colors inline-flex items-center"
          >
            &larr; Back to Dashboard
          </Link>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex gap-3 text-red-800 animate-in fade-in slide-in-from-top-4">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold">Update Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex gap-3 text-emerald-800 animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold">Article Updated Successfully!</h3>
              <p className="text-sm text-emerald-700 mt-1">Changes are now live.</p>
            </div>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-zinc-200 shadow-xl shadow-zinc-200/40 overflow-hidden">
          <div className="p-8 space-y-8">
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-2">Article Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-zinc-900 placeholder:text-zinc-400 font-medium text-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-zinc-900 mb-2 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-zinc-400" />
                    Category
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-zinc-900 appearance-none"
                    >
                      <option value="" disabled>Select a category...</option>
                      {flatCategories.map((cat) => (
                        <option 
                          key={cat.slug} 
                          value={cat.slug} 
                          disabled={cat.isParent}
                          className={cat.isParent ? "font-bold text-zinc-400 bg-zinc-100" : ""}
                        >
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-900 mb-2 flex items-center gap-2">
                    <LayoutTemplate className="w-4 h-4 text-zinc-400" />
                    Status
                  </label>
                  <div className="relative">
                    <select
                      name="status"
                      required
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-zinc-900 appearance-none font-medium"
                    >
                      <option value="published">🟢 Published (Live)</option>
                      <option value="draft">🟡 Draft (Hidden)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-2">Article Content</label>
                <div className="p-1.5 rounded-2xl bg-zinc-50 border border-zinc-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                  <textarea
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleChange}
                    rows={12}
                    className="w-full p-3 bg-transparent outline-none text-zinc-900 placeholder:text-zinc-400 resize-y"
                  />
                </div>
              </div>
            </div>

          </div>

          <div className="p-8 bg-zinc-50 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="w-full sm:w-auto">
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5" />
                Admin Secret Key
              </label>
              <input
                type="password"
                name="secret"
                required
                value={formData.secret}
                onChange={handleChange}
                className="w-full sm:w-64 px-4 py-2.5 rounded-lg border border-zinc-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-zinc-900 font-mono text-sm placeholder:font-sans"
                placeholder="Enter secret to authorize..."
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-white font-semibold shadow-lg transition-all duration-300 ${
                isLoading 
                  ? "bg-indigo-400 shadow-none cursor-not-allowed" 
                  : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-600/30 hover:-translate-y-0.5"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
