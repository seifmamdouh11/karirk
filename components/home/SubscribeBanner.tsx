"use client";

import React, { useState } from "react";
import axios from "axios";
import { Mail, CheckCircle2, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function SubscribeBanner() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await axios.post("/api/subscribe", { email });

      if (res.data && res.data.success) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
        setErrorMessage(res.data?.message || t("home.failed"));
      }
    } catch (err: any) {
      console.error("Subscription error:", err);
      setStatus("error");
      const msg = err.response?.data?.message || t("home.failed");
      setErrorMessage(msg);
    }
  };

  return (
    <section className="w-full relative overflow-hidden bg-gradient-to-tr from-blue-700 via-blue-600 to-blue-500 rounded-3xl p-8 sm:p-12 lg:p-16 text-white shadow-xl shadow-blue-500/10 border border-blue-600/30">
      
      {/* Decorative circle blurs */}
      <div className="absolute top-[-30%] start-[-10%] w-[350px] h-[350px] bg-white/10 rounded-full blur-3xl -z-10 animate-pulse duration-[8000ms]"></div>
      <div className="absolute bottom-[-20%] end-[-10%] w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-4xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* Left column: titles */}
        <div className="flex-1 text-center lg:text-start">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display tracking-tight leading-tight">
            {t("home.subscribeTitle")}
          </h2>
          <p className="text-blue-100 text-sm sm:text-base mt-3 max-w-md">
            {t("home.subscribeSubtitle")}
          </p>
        </div>

        {/* Right column: form */}
        <div className="w-full lg:w-auto shrink-0 min-w-[280px] sm:min-w-[420px]">
          {status === "success" ? (
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl animate-in fade-in zoom-in duration-300">
              <CheckCircle2 className="w-8 h-8 text-blue-100 shrink-0" />
              <div>
                <h4 className="font-bold text-sm">{t("home.success")}</h4>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
              <div className="flex flex-col sm:flex-row gap-2 bg-white/5 backdrop-blur-md border border-white/10 p-1.5 rounded-2xl focus-within:border-white/30 transition-colors">
                <div className="flex items-center gap-2.5 px-3 flex-1">
                  <Mail className="w-5 h-5 text-blue-200 shrink-0" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("home.subscribePlaceholder")}
                    className="bg-transparent border-0 text-sm w-full py-3 focus:ring-0 focus:outline-none text-white placeholder-blue-200"
                    disabled={status === "loading"}
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex items-center justify-center gap-1.5 px-6 py-3 bg-white hover:bg-zinc-50 text-blue-700 hover:text-blue-800 text-sm font-semibold rounded-xl hover:shadow-lg active:scale-98 disabled:opacity-50 transition-all duration-200 shrink-0"
                >
                  <span>{status === "loading" ? t("home.submitting") : t("home.subscribeButton")}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
              
              {status === "error" && (
                <p className="text-blue-100 text-xs font-semibold px-2 animate-in slide-in-from-top-1">
                  {errorMessage}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
