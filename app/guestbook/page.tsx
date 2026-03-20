/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguageStore } from "../stores/language-store";
import { useThemeStore } from "../stores/theme-store";
import { guestbookConfig } from "../site-config";
import LoadingScreen from "../components/effects/LoadingScreen";
import SEOHead from "../components/seo/SEOHead";
import WalineComments from "../components/waline/WalineComments.jsx";
import "../css/waline.css";

export default function GuestbookPage() {
  const { t, hydrated, hydrate, language } = useLanguageStore();
  const { theme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    hydrate();
    setMounted(true);
  }, [hydrate]);

  if (!hydrated || !mounted) {
    return <LoadingScreen />;
  }

  const colors = {
    background: theme === "dark" ? "bg-gradient-to-br from-[#0a0a0a] via-[#0f0f23] to-[#1a1a2e]" : "bg-gradient-to-br from-gray-50 via-white to-gray-100",
    card: theme === "dark" ? "bg-white/5 backdrop-blur-md border border-white/10" : "bg-white/80 backdrop-blur-md border border-gray-200",
    text: theme === "dark" ? "text-white" : "text-gray-900",
    textSecondary: theme === "dark" ? "text-gray-400" : "text-gray-600",
  };

  const walineUrl = guestbookConfig?.walineUrl || "";
  const pageTitle = guestbookConfig?.title?.[language] || t("guestbook");

  return (
    <>
      <SEOHead
        title={pageTitle}
        description={pageTitle}
        url={`${process.env.NEXT_PUBLIC_SITE_URL || ""}/guestbook`}
      />
      <div className={`min-h-screen ${colors.background}`}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <header className="mb-8">
            <Link
              href="/"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${colors.card} ${colors.text} hover:bg-blue-500/10 transition-all mb-6`}
            >
              <i className="fas fa-arrow-left"></i>
              <span>{t("backToHome")}</span>
            </Link>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 mb-4">
                <i className="fas fa-comments text-white text-2xl"></i>
              </div>
              <h1 className={`text-3xl font-bold ${colors.text} mb-2`}>{pageTitle}</h1>
              <p className={colors.textSecondary}>
                {language === "zh" ? "欢迎留下你的足迹" : "Leave your footprint here"}
              </p>
            </div>
          </header>

          <div className={`${colors.card} rounded-2xl p-6 min-h-[500px]`}>
            {walineUrl ? (
              <WalineComments path="/guestbook" />
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center mb-4">
                  <i className="fas fa-cog text-white text-3xl"></i>
                </div>
                <h3 className={`text-xl font-semibold ${colors.text} mb-2`}>
                  {language === "zh" ? "留言板未配置" : "Guestbook Not Configured"}
                </h3>
                <p className={colors.textSecondary}>
                  {language === "zh" 
                    ? "请在配置页面设置 Waline 服务端地址" 
                    : "Please configure Waline server URL in the admin page"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
