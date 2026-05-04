"use client";

import { useState } from "react";
import portfolio from "@/data/portfolio";
import { useLanguage } from "@/components/LanguageProvider";
import { trackEvent } from "@/lib/analytics";

const Hero = () => {
  const { personal } = portfolio;
  const { t } = useLanguage();
  const [cursor, setCursor] = useState({ x: 50, y: 50, active: false });
  const [photoMotion, setPhotoMotion] = useState({ rotateX: 0, rotateY: 0, active: false });

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    setCursor({ x, y, active: true });
  };

  const handleMouseLeave = () => {
    setCursor((prev) => ({ ...prev, active: false }));
  };

  const handlePhotoMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 14;
    const rotateX = (0.5 - py) * 14;

    setPhotoMotion({ rotateX, rotateY, active: true });
  };

  const handlePhotoLeave = () => {
    setPhotoMotion({ rotateX: 0, rotateY: 0, active: false });
  };

  return (
    <section
      className="relative bg-[var(--color-bg)] text-white overflow-hidden pt-24"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      id="home"
    >
      {/* Background geometric elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)] opacity-5 rounded-full blur-3xl -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-secondary)] opacity-5 rounded-full blur-3xl -ml-48 -mb-48"></div>
      <div
        className={`pointer-events-none absolute w-72 h-72 rounded-full blur-3xl transition-opacity duration-300 ${
          cursor.active ? 'opacity-35' : 'opacity-0'
        }`}
        style={{
          left: `${cursor.x}%`,
          top: `${cursor.y}%`,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, var(--color-accent) 0%, rgba(0, 212, 170, 0.08) 60%, transparent 100%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 py-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left side - Text */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter">
                <span className="text-[var(--color-accent)]">{personal.name}</span>
              </h1>
            </div>

            <div className="border-l-4 border-[var(--color-primary)] pl-6">
              <h2 className="text-2xl font-black tracking-wide mb-4">{t("hero.headline")}</h2>
              <p className="text-[var(--color-text-muted)] text-lg leading-relaxed">
                {t("hero.summary")}
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <a
                href="/cv.pdf"
                download="Dzaki-Amri-Zaidaan-CV.pdf"
                className="bg-[var(--color-primary)] text-white px-8 py-4 font-black text-sm tracking-wide uppercase hover:bg-[var(--color-secondary)] transition border-2 border-[var(--color-primary)]"
                onClick={() => trackEvent("download_cv_click")}
              >
                {t("hero.download")}
              </a>
              <a
                href="#contact"
                className="border-2 border-[var(--color-primary)] text-[var(--color-primary)] px-8 py-4 font-black text-sm tracking-wide uppercase hover:bg-[var(--color-primary)] hover:text-white transition"
                onClick={() => trackEvent("hero_contact_click")}
              >
                {t("hero.contact")}
              </a>
            </div>
          </div>

          {/* Right side - Avatar Placeholder */}
          <div className="flex justify-center md:justify-end">
            <div
              className="relative w-64 h-64 md:w-80 md:h-80 border-4 border-[var(--color-primary)] hero-avatar flex items-center justify-center bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)]"
              onMouseMove={handlePhotoMove}
              onMouseLeave={handlePhotoLeave}
              style={{
                transform: `perspective(900px) rotateX(${photoMotion.rotateX}deg) rotateY(${photoMotion.rotateY}deg) scale(${photoMotion.active ? 1.02 : 1})`,
                transition: photoMotion.active ? 'transform 120ms linear' : 'transform 260ms ease',
              }}
            >
              {/* Inner border accent */}
              <div className="absolute inset-0 border-2 border-[var(--color-secondary)] m-2"></div>
              <div className="absolute -inset-3 border border-[var(--color-accent)]/50 pointer-events-none hero-avatar-ring"></div>
              
              {/* Avatar with initials */}
              <div className="relative z-10 text-center">
                <div className="text-6xl font-black text-white tracking-tighter">DAZ</div>
                <p className="text-sm text-white/80 mt-2 font-medium tracking-widest uppercase">{personal.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;