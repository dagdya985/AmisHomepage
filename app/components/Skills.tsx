"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { skillsConfig } from "../config";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

export default function Skills() {
  const { t } = useLanguage();
  const [animatedLevels, setAnimatedLevels] = useState<Record<string, number>>({});

  const skillsSection = useScrollAnimation({ threshold: 0.1 });

  useEffect(() => {
    if (skillsSection.isVisible) {
      skillsConfig.forEach((skill) => {
        let start = 0;
        const end = skill.level;
        const duration = 1500;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeOutQuart = 1 - Math.pow(1 - progress, 4);
          
          setAnimatedLevels((prev) => ({
            ...prev,
            [skill.name]: Math.round(start + (end - start) * easeOutQuart),
          }));

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };

        requestAnimationFrame(animate);
      });
    }
  }, [skillsSection.isVisible]);

  return (
    <div id="skills" className="w-full max-w-3xl mx-auto">
      <div 
        ref={skillsSection.ref as React.RefObject<HTMLDivElement>}
        className={`relative group transition-all duration-1000 ${
          skillsSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 via-teal-500/30 to-cyan-500/30 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-500"></div>
        <div className="relative bg-[#0d0d1a]/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10 hover:border-white/20 transition-all duration-300">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-600 flex items-center justify-center">
              <i className="fas fa-chart-line text-white text-sm"></i>
            </span>
            {t("skills")}
          </h3>

          <div className="space-y-4">
            {skillsConfig.map((skill, index) => (
              <div key={skill.name} className="group/skill">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-lg bg-gradient-to-br ${skill.color} flex items-center justify-center`}>
                      <i className={`${skill.icon} text-white text-xs`}></i>
                    </span>
                    <span className="text-white font-medium">{skill.name}</span>
                  </div>
                  <span className="text-white/60 text-sm font-mono">
                    {animatedLevels[skill.name] || 0}%
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000 ease-out group-hover/skill:brightness-110`}
                    style={{ 
                      width: `${animatedLevels[skill.name] || 0}%`,
                      transitionDelay: `${index * 100}ms`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
