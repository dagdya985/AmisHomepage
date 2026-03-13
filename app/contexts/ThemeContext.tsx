"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("theme", theme);
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    // 第一步：开始过渡，显示模糊遮罩
    setIsTransitioning(true);
    
    // 第二步：等待模糊效果达到最大后切换主题
    setTimeout(() => {
      setTheme((prev) => (prev === "dark" ? "light" : "dark"));
      
      // 第三步：等待主题切换完成后，移除模糊遮罩
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 200);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isTransitioning }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
