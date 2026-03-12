"use client";

import { useLanguage } from "../contexts/LanguageContext";

export default function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 text-white/90 hover:text-white transition-colors px-3 py-1 rounded-full border border-white/30 hover:border-white/50"
      title={language === "zh" ? "Switch to English" : "切换到中文"}
    >
      <i className="fas fa-language"></i>
      <span className="text-sm font-medium">
        {language === "zh" ? "EN" : "中"}
      </span>
    </button>
  );
}
