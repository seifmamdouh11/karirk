"use client";

import React, { useEffect, useRef } from "react";
import { useLanguage } from "@/lib/LanguageContext";

interface AdBannerProps {
  dataAdSlot: string;
  dataAdFormat?: string;
  dataFullWidthResponsive?: string;
  className?: string;
}

export default function AdBanner({ 
  dataAdSlot, 
  dataAdFormat = "auto", 
  dataFullWidthResponsive = "true",
  className = ""
}: AdBannerProps) {
  const { t } = useLanguage();
  const adRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);
  
  useEffect(() => {
    try {
      if (!pushedRef.current && adRef.current) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        pushedRef.current = true;
      }
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, []);

  return (
    <div className={`w-full bg-zinc-50 dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center overflow-hidden relative ${className}`}>
      {/* Fallback/Placeholder Text - Shows if AdBlock is active or ads haven't loaded */}
      <span className="absolute text-xs font-semibold tracking-widest text-zinc-400 dark:text-zinc-600 uppercase pointer-events-none">
        Advertisement
      </span>
      
      {/* AdSense ins tag */}
      <ins
        ref={adRef}
        className="adsbygoogle w-full h-full block z-10"
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" /* Replace with your actual AdSense Publisher ID */
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive}
      />
    </div>
  );
}
