"use client";

import { useTheme } from "../contexts/ThemeContext";

export default function ThemeTransition() {
  const { isTransitioning } = useTheme();

  if (!isTransitioning) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-none bg-black/30 backdrop-blur-md"
      style={{
        animation: "blurFade 0.5s ease-in-out forwards",
      }}
    >
      <style jsx>{`
        @keyframes blurFade {
          0% {
            opacity: 0;
            backdrop-filter: blur(0px);
          }
          40% {
            opacity: 1;
            backdrop-filter: blur(8px);
          }
          60% {
            opacity: 1;
            backdrop-filter: blur(8px);
          }
          100% {
            opacity: 0;
            backdrop-filter: blur(0px);
          }
        }
      `}</style>
    </div>
  );
}
