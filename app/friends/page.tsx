/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguageStore } from "../stores/language-store";
import { useThemeStore } from "../stores/theme-store";
import { friendLinksConfig } from "../site-config";
import LoadingScreen from "../components/effects/LoadingScreen";
import SEOHead from "../components/seo/SEOHead";
import type { FriendLink } from "../../types";

export default function FriendLinksPage() {
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
    card: theme === "dark" ? "bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20" : "bg-white/80 backdrop-blur-md border border-gray-200 hover:border-gray-300",
    text: theme === "dark" ? "text-white" : "text-gray-900",
    textSecondary: theme === "dark" ? "text-gray-400" : "text-gray-600",
  };

  const links: FriendLink[] = friendLinksConfig?.links || [];
  const pageTitle = friendLinksConfig?.title?.[language] || t("friendLinks");

  const getFaviconUrl = (url: string, avatar?: string) => {
    if (avatar) return avatar;
    try {
      const urlObj = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;
    } catch {
      return null;
    }
  };

  return (
    <>
      <SEOHead
        title={pageTitle}
        description={pageTitle}
        url={`${process.env.NEXT_PUBLIC_SITE_URL || ""}/friends`}
      />
      <div className={`min-h-screen ${colors.background}`}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <header className="mb-8">
            <Link
              href="/"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${colors.card} ${colors.text} hover:bg-blue-500/10 transition-all mb-6`}
            >
              <i className="fas fa-arrow-left"></i>
              <span>{t("backToHome")}</span>
            </Link>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 mb-4">
                <i className="fas fa-link text-white text-2xl"></i>
              </div>
              <h1 className={`text-3xl font-bold ${colors.text} mb-2`}>{pageTitle}</h1>
              <p className={colors.textSecondary}>
                {language === "zh" ? "与优秀的人为伍，与有趣的灵魂相遇" : "Connect with interesting souls"}
              </p>
            </div>
          </header>

          {links.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group ${colors.card} rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
                >
                  <div className="flex items-start gap-4">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex-shrink-0">
                      {getFaviconUrl(link.url, link.avatar) ? (
                        <Image
                          src={getFaviconUrl(link.url, link.avatar) || ""}
                          alt={link.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <i className="fas fa-globe text-2xl text-gray-400"></i>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold ${colors.text} group-hover:text-blue-500 transition-colors truncate`}>
                        {link.name}
                      </h3>
                      <p className={`text-sm ${colors.textSecondary} mt-1 line-clamp-2`}>
                        {link.description?.[language] || link.description?.zh || ""}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className={`text-xs ${colors.textSecondary} truncate max-w-[70%]`}>
                      {(() => {
                        try {
                          return new URL(link.url).hostname;
                        } catch {
                          return link.url;
                        }
                      })()}
                    </span>
                    <span className="text-xs text-blue-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {t("visitSite")}
                      <i className="fas fa-external-link-alt text-[10px]"></i>
                    </span>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className={`${colors.card} rounded-2xl p-12 text-center`}>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-user-friends text-white text-3xl"></i>
              </div>
              <h3 className={`text-xl font-semibold ${colors.text} mb-2`}>
                {t("noFriendLinks")}
              </h3>
              <p className={colors.textSecondary}>
                {language === "zh" 
                  ? "暂无友链，请在配置页面添加" 
                  : "No friend links yet, please add in the admin page"}
              </p>
            </div>
          )}

          <div className={`mt-12 ${colors.card} rounded-2xl p-6 text-center`}>
            <h3 className={`font-semibold ${colors.text} mb-2`}>
              {language === "zh" ? "申请友链" : "Apply for Friend Link"}
            </h3>
            <p className={`text-sm ${colors.textSecondary}`}>
              {language === "zh" 
                ? "欢迎交换友链，请通过邮件或留言板联系我" 
                : "Welcome to exchange friend links, please contact me via email or guestbook"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
