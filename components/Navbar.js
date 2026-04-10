'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import portfolio from '@/data/portfolio';

const Navbar = () => {
  const { navigation } = portfolio;
  const [isOpen, setIsOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('');

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) {
        setScrollProgress(0);
      } else {
        setScrollProgress((window.scrollY / maxScroll) * 100);
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sectionIds = navigation
      .map((item) => item.href.replace('#', '').trim())
      .filter(Boolean);

    const sections = sectionIds
      .map((id) => ({ id, element: document.getElementById(id) }))
      .filter((entry) => entry.element);

    if (!sections.length) {
      return;
    }

    setActiveSection((prev) => prev || sections[0].id);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (!visibleEntries.length) {
          return;
        }

        const activeId = visibleEntries[0].target.id;
        setActiveSection(activeId);
      },
      {
        root: null,
        rootMargin: '-25% 0px -55% 0px',
        threshold: [0.2, 0.35, 0.5, 0.7],
      }
    );

    sections.forEach((entry) => observer.observe(entry.element));

    return () => {
      sections.forEach((entry) => observer.unobserve(entry.element));
      observer.disconnect();
    };
  }, [navigation]);

  return (
    <nav className="bg-[var(--color-bg)] border-b-2 border-[var(--color-border)] text-white px-6 fixed top-0 w-full z-20">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-20">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
          <div className="w-12 h-12 relative">
            <Image src="/img/logo.png" alt="DAZ Logo" fill style={{ objectFit: 'contain' }} />
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-12">
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
            >
              {item.label}
            </Link>
            );
          })}
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
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
            );
          })}
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