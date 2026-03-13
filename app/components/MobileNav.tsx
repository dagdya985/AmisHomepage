"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../contexts/LanguageContext";

type Section = "about" | "projects" | "skills";

export default function MobileNav() {
  const { t } = useLanguage();
  const [currentSection, setCurrentSection] = useState<Section>("projects");
  const [isVisible, setIsVisible] = useState(false);
  const isScrollingRef = useRef(false);

  const sections: { id: Section; icon: string }[] = [
    { id: "projects", icon: "fas fa-star" },
    { id: "about", icon: "fas fa-user" },
    { id: "skills", icon: "fas fa-chart-line" },
  ];

  const scrollToSection = (sectionId: Section) => {
    const section = document.getElementById(sectionId);
    if (section) {
      isScrollingRef.current = true;
      setCurrentSection(sectionId);
      section.scrollIntoView({ behavior: "smooth" });
      
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 1000);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isScrollingRef.current) return;

      const sections = ["projects", "about", "skills"];
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2;
          if (isVisible) {
            setCurrentSection(sectionId as Section);
            break;
          }
        }
      }

      const scrollY = window.scrollY;
      setIsVisible(scrollY > window.innerHeight * 0.5);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [t]);

  return (
    <div className={`fixed bottom-4 right-4 z-40 md:hidden transition-all duration-300 ${
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
    }`}>
      <div className="flex flex-col gap-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${
              currentSection === section.id
                ? "bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg scale-110"
                : "bg-white/10 hover:bg-white/20 backdrop-blur-sm"
            }`}
            title={section.id}
          >
            <i className={`${section.icon} text-white text-sm`}></i>
          </button>
        ))}
      </div>
    </div>
  );
}
