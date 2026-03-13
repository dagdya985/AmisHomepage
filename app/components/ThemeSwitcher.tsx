"use client";

import { useTheme } from "../contexts/ThemeContext";

export default function ThemeSwitcher() {
  const { theme, toggleTheme, isTransitioning } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      disabled={isTransitioning}
      className={`relative w-10 h-10 rounded-full transition-all duration-300 hover:scale-110 flex items-center justify-center overflow-hidden ${
        theme === "dark" ? "bg-white/10 hover:bg-white/20" : "bg-gray-200 hover:bg-gray-300"
      } ${isTransitioning ? "opacity-50 cursor-not-allowed" : ""}`}
      title={theme === "dark" ? "切换到亮色模式" : "切换到暗色模式"}
    >
      <div className="relative w-full h-full">
        <div 
          className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
            theme === "dark" ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-0"
          }`}
        >
          <i className="fas fa-moon text-white text-lg"></i>
        </div>
        <div 
          className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
            theme === "light" ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
          }`}
        >
          <i className="fas fa-sun text-yellow-500 text-lg"></i>
        </div>
      </div>
    </button>
  );
}
