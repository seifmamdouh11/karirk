"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Briefcase, Send, AlertCircle, CheckCircle2, LayoutTemplate, Key, MapPin, Building2, Globe, DollarSign, Link as LinkIcon, FileText } from "lucide-react";
import Link from "next/link";

type CategoryItem = { _id: string; name: string; slug: string };
type CategoryWithSubcategories = CategoryItem & { subcategories: CategoryItem[] };

type ErrorLike = { response?: { data?: { error?: string; message?: string } } };

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

export default function SingleJobForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "remote",
    country: "saudiarabia",
    type: "full-time",
    salary: "",
    category: "",
    applyLink: "",
    status: "active",
    description: "",
    secret: "",
  });

  const [categories, setCategories] = useState<CategoryWithSubcategories[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/categories");
        if (res.data && res.data.success) {
          setCategories(res.data.data);
          if (res.data.data.length > 0) {
            setFormData(prev => ({ ...prev, category: res.data.data[0].slug }));
          }
        }
      } catch (err: unknown) {
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
      const res = await axios.post(`/api/admin/jobs`, 
        {
          title: formData.title,
          company: formData.company,
          location: formData.location,
          country: formData.country,
          type: formData.type,
          salary: formData.salary,
          category: formData.category,
          applyLink: formData.applyLink,
          status: formData.status,
          description: formData.description,
        },
        {
          headers: {
            secret: formData.secret,
          },
        }
      );

      if (res.data && (res.data.job || res.status === 201)) {
        const slug = res.data.job?.slug;
        if (slug) {
          // Redirect to admin preview page
          router.push(`/jobs/${slug}`);
        } else {
          setSuccess(true);
        }
        // Reset form
        setFormData(prev => ({
          ...prev,
          title: "",
          company: "",
          salary: "",
          applyLink: "",
          description: "",
        }));
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err: unknown) {
      console.error(err);
      const errorData = err as ErrorLike;
      setError(
        errorData.response?.data?.error || 
        errorData.response?.data?.message || 
        getErrorMessage(err) ||
        "Failed to create job. Please check your secret key and try again."
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
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/20">
            <Briefcase className="w-6 h-6" />
          </div>
          Create Job Listing
        </h1>
        <p className="mt-2 text-zinc-500">Publish a new job vacancy directly to the platform.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex gap-3 text-red-800">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold">Submission Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex gap-3 text-emerald-800">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold">Job Created Successfully!</h3>
            <p className="text-sm text-emerald-700 mt-1">Your job is now live on the platform.</p>
            <Link
              href="/admin/manage"
              className="inline-block mt-3 text-sm font-medium text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-lg hover:bg-emerald-200 transition-colors"
            >
              Back to Dashboard &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-zinc-200 shadow-xl shadow-zinc-200/40 overflow-hidden">
        <div className="p-8 space-y-8">
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-2">Job Title</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-zinc-900 font-medium text-lg"
                placeholder="e.g. Senior Frontend Developer"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-zinc-400" />
                  Company Name
                </label>
                <input
                  type="text"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-zinc-900"
                  placeholder="e.g. Acme Corp"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-2 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-zinc-400" />
                  Job Type
                </label>
                <select
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-zinc-900"
                >
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-zinc-400" />
                  Country
                </label>
                <select
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-zinc-900"
                >
                  <option value="saudiarabia">Saudi Arabia</option>
                  <option value="unitedarabemirates">United Arab Emirates</option>
                  <option value="egypt">Egypt</option>
                  <option value="jordan">Jordan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-zinc-400" />
                  Location
                </label>
                <select
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-zinc-900"
                >
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-site</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-2 flex items-center gap-2">
                  <LayoutTemplate className="w-4 h-4 text-zinc-400" />
                  Category
                </label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-zinc-900"
                >
                  <option value="" disabled>Select...</option>
                  {flatCategories.map((cat) => (
                    <option key={cat.slug} value={cat.slug} disabled={cat.isParent} className={cat.isParent ? "font-bold text-zinc-400 bg-zinc-100" : ""}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-zinc-400" />
                  Salary
                </label>
                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-zinc-900"
                  placeholder="e.g. $5000/mo or Competitive"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-2 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-zinc-400" />
                  Apply Link
                </label>
                <input
                  type="url"
                  name="applyLink"
                  required
                  value={formData.applyLink}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-zinc-900"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-zinc-400" />
                  Status
                </label>
                <select
                  name="status"
                  required
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-zinc-900 font-medium"
                >
                  <option value="active">🟢 Active</option>
                  <option value="inactive">🔴 Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-2">Job Description</label>
              <div className="p-1.5 rounded-2xl bg-zinc-50 border border-zinc-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                <textarea
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  rows={10}
                  className="w-full p-3 bg-transparent outline-none text-zinc-900 resize-y"
                  placeholder="Enter full job description..."
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
                Publishing...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Publish Job
              </>
            )}
          </button>
        </div>
      </form>

    </div>
  );
}
