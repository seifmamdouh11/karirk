"use client";
import React, { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, FileText, UploadCloud, ChevronRight } from "lucide-react";
import SingleJobForm from "./SingleJobForm";
import BulkImportTool from "./BulkImportTool";

export default function ImportJobsPage() {
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center text-xs font-semibold text-zinc-400 space-x-2.5 uppercase tracking-wider">
          <Link href="/admin/manage" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5">
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-300" />
          <span className="text-zinc-700">Add Jobs</span>
        </nav>

        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-zinc-200/85 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl text-white shadow-lg shadow-indigo-600/20">
              <UploadCloud className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-zinc-900">Add New Jobs</h1>
              <p className="text-xs font-medium text-zinc-500 mt-0.5">Select single entry or mass JSON importing.</p>
            </div>
          </div>
          
          <div className="flex bg-zinc-100/60 p-1.5 rounded-2xl border border-zinc-200/50">
            <button
              onClick={() => setActiveTab("single")}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                activeTab === "single" 
                  ? "bg-white text-indigo-600 shadow-md shadow-zinc-250/20" 
                  : "text-zinc-500 hover:text-zinc-700 hover:bg-white/40"
              }`}
            >
              <FileText className="w-4 h-4" />
              Single Job Form
            </button>
            <button
              onClick={() => setActiveTab("bulk")}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                activeTab === "bulk" 
                  ? "bg-white text-indigo-600 shadow-md shadow-zinc-250/20" 
                  : "text-zinc-500 hover:text-zinc-700 hover:bg-white/40"
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
