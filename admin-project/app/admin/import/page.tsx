"use client";
import React, { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, FileText, UploadCloud, ChevronRight } from "lucide-react";
import SingleJobForm from "./SingleJobForm";
import BulkImportTool from "./BulkImportTool";

export default function ImportJobsPage() {
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");

  return (
    <div className="min-h-screen bg-zinc-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm font-medium text-zinc-500 space-x-2">
          <Link href="/admin/manage" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5">
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <ChevronRight className="w-4 h-4 text-zinc-400" />
          <span className="text-zinc-900">Add Jobs</span>
        </nav>

        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Add New Jobs</h1>
            <p className="text-sm text-zinc-500">Choose how you want to add jobs to the platform.</p>
          </div>
          
          <div className="flex bg-zinc-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("single")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "single" 
                  ? "bg-white text-indigo-600 shadow-sm" 
                  : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200/50"
              }`}
            >
              <FileText className="w-4 h-4" />
              Single Job Form
            </button>
            <button
              onClick={() => setActiveTab("bulk")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "bulk" 
                  ? "bg-white text-indigo-600 shadow-sm" 
                  : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200/50"
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              Bulk Import Tool
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === "single" ? <SingleJobForm /> : <BulkImportTool />}
        </div>
        
      </div>
    </div>
  );
}
