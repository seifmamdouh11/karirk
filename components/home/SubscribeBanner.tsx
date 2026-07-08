"use client";

import React, { useState } from "react";
import axios from "axios";
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
    <section>
      <div>
        <div>
          <h2>{t("home.subscribeTitle")}</h2>
          <p>{t("home.subscribeSubtitle")}</p>
        </div>

        <div>
          {status === "success" ? (
            <div>
              <h4>{t("home.success")}</h4>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div>
                <div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("home.subscribePlaceholder")}
                    disabled={status === "loading"}
                  />
                </div>
                <button type="submit" disabled={status === "loading"}>
                  <span>{status === "loading" ? t("home.submitting") : t("home.subscribeButton")}</span>
                </button>
              </div>
              
              {status === "error" && (
                <p>{errorMessage}</p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
