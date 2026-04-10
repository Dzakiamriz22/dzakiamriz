'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import portfolio from '@/data/portfolio';
import { useLanguage } from '@/components/LanguageProvider';
import { trackEvent } from '@/lib/analytics';

const Navbar = () => {
  const { navigation } = portfolio;
  const { lang, t, toggleLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('');
  const [logoMotion, setLogoMotion] = useState({ x: 0, y: 0, rotate: 0, active: false });

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogoMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const x = (px - 0.5) * 12;
    const y = (py - 0.5) * 12;
    const rotate = (px - 0.5) * 14;

    setLogoMotion({ x, y, rotate, active: true });
  };

  const resetLogoMove = () => {
    setLogoMotion({ x: 0, y: 0, rotate: 0, active: false });
  };

  const getNavLabel = (href) => {
    const id = href.replace('#', '').trim();
    const map = {
      about: 'navbar.about',
      experience: 'navbar.experience',
      projects: 'navbar.projects',
      contact: 'navbar.contact',
    };
    return t(map[id] || 'navbar.projects');
  };

  useEffect(() => {
    const sectionIds = navigation
      .map((item) => item.href.replace('#', '').trim())
      .filter(Boolean);

    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) {
        setScrollProgress(0);
      } else {
        setScrollProgress((window.scrollY / maxScroll) * 100);
      }

      const markerY = window.scrollY + 130;
      let current = sectionIds[0] || '';

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (!element) continue;
        if (element.offsetTop <= markerY) {
          current = id;
        }
      }

      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (isAtBottom && sectionIds.length) {
        current = sectionIds[sectionIds.length - 1];
      }

      setActiveSection(current);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [navigation]);

  return (
    <nav className="bg-[var(--color-bg)] border-b-2 border-[var(--color-border)] text-white px-6 fixed top-0 w-full z-20">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-20">
        {/* Logo / Brand */}
        <Link
          href="/"
          className="flex items-center gap-3 transition"
          onMouseMove={handleLogoMove}
          onMouseLeave={resetLogoMove}
        >
          <div
            className={`w-12 h-12 relative rounded-sm transition-transform duration-200 ${
              logoMotion.active ? 'drop-shadow-[0_0_18px_rgba(0,212,170,0.35)]' : ''
            }`}
            style={{
              transform: `translate(${logoMotion.x}px, ${logoMotion.y}px) rotate(${logoMotion.rotate}deg) scale(${logoMotion.active ? 1.08 : 1})`,
            }}
          >
            <Image src="/img/logo.png" alt="DAZ Logo" fill style={{ objectFit: 'contain' }} />
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center">
          {navigation.map((item) => {
            const sectionId = item.href.replace('#', '').trim();
            const isActive = activeSection === sectionId;

            return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`text-sm font-bold tracking-wide transition uppercase border-b-2 pb-1 ${
                isActive
                  ? 'text-[var(--color-accent)] border-[var(--color-accent)]'
                  : 'text-[var(--color-text-muted)] border-transparent hover:text-[var(--color-accent)]'
              }`}
              onClick={() => trackEvent('nav_click', { target: sectionId })}
            >
              {getNavLabel(item.href)}
            </Link>
            );
          })}
          <button
            type="button"
            onClick={() => {
              toggleLanguage();
              trackEvent('language_toggle', { from: lang, to: lang === 'en' ? 'id' : 'en' });
            }}
            className="px-3 py-2 border-2 border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] text-xs font-black uppercase transition"
          >
            {t('navbar.language')}
          </button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="md:hidden">
          <button 
            className="text-[var(--color-accent)] hover:text-[var(--color-primary)] transition font-bold"
            onClick={toggleMenu}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[var(--color-bg-secondary)] border-t-2 border-[var(--color-border)] text-white p-6 space-y-4 scanline">
          {navigation.map((item) => {
            const sectionId = item.href.replace('#', '').trim();
            const isActive = activeSection === sectionId;

            return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`block text-sm font-bold tracking-wide transition uppercase ${
                isActive
                  ? 'text-[var(--color-accent)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-accent)]'
              }`}
              onClick={() => {
                setIsOpen(false);
                trackEvent('nav_click', { target: sectionId });
              }}
            >
              {getNavLabel(item.href)}
            </Link>
            );
          })}
          <button
            type="button"
            onClick={() => {
              toggleLanguage();
              trackEvent('language_toggle', { from: lang, to: lang === 'en' ? 'id' : 'en', mobile: true });
            }}
            className="block w-full text-left px-0 py-1 text-sm font-bold tracking-wide text-[var(--color-text-muted)] hover:text-[var(--color-accent)] uppercase transition"
          >
            {t('navbar.language')}
          </button>
        </div>
      )}

      <div className="h-1 bg-[var(--color-border)]">
        <div
          className="h-full bg-[var(--color-accent)] transition-[width] duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </nav>
  );
};

export default Navbar;