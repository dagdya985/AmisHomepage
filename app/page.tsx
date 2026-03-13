"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { linksConfig, socialConfig } from "./config";
import { useLanguage } from "./contexts/LanguageContext";
import TypeWriter from "./components/TypeWriter";
import LanguageSwitcher from "./components/LanguageSwitcher";
import DrawnTitle from "./components/DrawnTitle";
import Avatar from "./components/Avatar";
import AboutCard from "./components/AboutCard";
import FeaturedProjects from "./components/FeaturedProjects";
import Skills from "./components/Skills";
import StarryBackground from "./components/StarryBackground";
import LoadingScreen from "./components/LoadingScreen";
import SectionNav from "./components/SectionNav";
import MobileNav from "./components/MobileNav";

export default function Home() {
  const { language, t } = useLanguage();
  const nav = t("nav");
  const [isLoaded, setIsLoaded] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isLanguageChanging, setIsLanguageChanging] = useState(false);
  const [prevLanguage, setPrevLanguage] = useState(language);

  // 语言切换时的淡出淡入效果
  useEffect(() => {
    if (prevLanguage !== language) {
      setIsLanguageChanging(true);
      const timer = setTimeout(() => {
        setIsLanguageChanging(false);
        setPrevLanguage(language);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [language, prevLanguage]);

  // 页面加载动画
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // 监听滚动显示返回顶部按钮
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 平滑滚动到顶部
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <LoadingScreen />
      <div className={`min-h-screen font-sans transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        {/* 星空动态背景 */}
        <StarryBackground />
      
      {/* 全屏Header */}
      <header className="relative h-screen w-full">
        {/* 背景图 - 使用Next.js Image优化 */}
        <div className="absolute inset-0">
          <Image
            src="/images/index.jpg"
            alt="Background"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        
        {/* 遮罩层 */}
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* 导航栏 */}
        <nav className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12">
          
          {/* 语言切换 */}
          <LanguageSwitcher />
          
          {/* 桌面端导航菜单 */}
          <div id="menus" className="hidden md:flex items-center space-x-6">
            <a href={linksConfig.blog.url} className="text-white/90 hover:text-white transition-colors flex items-center gap-2">
              <i className="fas fa-blog fa-fw"></i>
              <span>{nav.blog}</span>
            </a>
            <a href={linksConfig.github.url} target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-white transition-colors flex items-center gap-2">
              <i className="fab fa-github fa-fw"></i>
              <span>{nav.github}</span>
            </a>
            <a href={linksConfig.gitee.url} target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-white transition-colors flex items-center gap-2">
              <i className="fab fa-gitee fa-fw"></i>
              <span>{nav.gitee}</span>
            </a>
          </div>
          
          {/* 移动端只显示语言切换 */}
          <div className="md:hidden">
            <LanguageSwitcher />
          </div>
        </nav>
        
        {/* 网站信息 */}
        <div 
          id="site-info" 
          className={`absolute inset-0 flex flex-col items-center justify-center text-center text-white z-5 overflow-visible px-4 transition-opacity duration-300 ${isLanguageChanging ? 'opacity-0' : 'opacity-100'}`}
        >
          {/* 头像 */}
          <Avatar 
            src="/images/avatar.jpg" 
            alt="Amis" 
            size={140} 
            className="mb-6"
          />
          
          <div className="min-h-[80px] flex items-center justify-center w-[90vw] mb-4">
            <DrawnTitle text={t("siteTitle")} className="w-full" />
          </div>
          <div id="site-subtitle" className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl px-4">
            <TypeWriter 
              key={language}
              texts={[t("typeWriterText"), t("typeWriterText2")]} 
              typeSpeed={120} 
              deleteSpeed={80}
              delay={800} 
              pauseTime={2000}
            />
          </div>
          
          {/* 社交图标 */}
          <div id="site_social_icons" className="flex items-center gap-4 flex-wrap justify-center">
            <a 
              href={linksConfig.email.url}
              rel="external nofollow noreferrer" 
              target="_blank" 
              title={linksConfig.email.title[language]}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 hover:scale-110 transition-all duration-300"
            >
              <i className="fas fa-envelope text-white"></i>
            </a>
            <a 
              href={linksConfig.github.url}
              target="_blank" 
              rel="noopener noreferrer"
              title={linksConfig.github.title[language]}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 hover:scale-110 transition-all duration-300"
            >
              <i className="fab fa-github text-white"></i>
            </a>
            <a 
              href={linksConfig.gitee.url}
              target="_blank" 
              rel="noopener noreferrer"
              title={linksConfig.gitee.title[language]}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 hover:scale-110 transition-all duration-300"
            >
              <i className="fab fa-gitee text-white"></i>
            </a>
            <a 
              href={linksConfig.blog.url}
              target="_blank"
              title={linksConfig.blog.title[language]}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 hover:scale-110 transition-all duration-300"
            >
              <i className="fas fa-blog text-white"></i>
            </a>
          </div>
        </div>
      </header>
      
      {/* 内容区域 - 关于我 */}
      <section id="content" className="py-16 px-6 md:px-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0f0f23]/80 to-[#1a1a2e]/90"></div>
        <div className="max-w-6xl mx-auto relative z-10 space-y-12">
          <FeaturedProjects />
          <AboutCard />
          <Skills />
        </div>
      </section>
      
      {/* 页脚 */}
      <footer className="bg-gradient-to-b from-[#1a1a2e]/90 to-[#0f0f23]/95 backdrop-blur-sm text-white py-8 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-white/60">
            {t("footer")}
          </p>
        </div>
      </footer>

      {/* 移动端底部导航 */}
      <MobileNav />

      {/* 侧边导航 */}
      <SectionNav />

      {/* 返回顶部按钮 */}
      <button
        onClick={scrollToTop}
        className={`fixed w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-50 ${
          showBackToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        } md:bottom-8 md:right-8 bottom-4 left-4`}
        aria-label="Back to top"
      >
        <i className="fas fa-arrow-up"></i>
      </button>
      </div>
    </>
  );
}
