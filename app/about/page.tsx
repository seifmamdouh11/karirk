"use client";

import React from "react";
import { useLanguage } from "@/lib/LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold font-display tracking-tight mb-4">
        {t("about.title")}
      </h1>
      <p className="text-zinc-650 dark:text-zinc-400 text-base leading-relaxed">
        {t("about.description")}
      </p>
    </div>
  );
}
