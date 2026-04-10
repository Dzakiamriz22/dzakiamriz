'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import portfolio from '@/data/portfolio';

const Navbar = () => {
  const { personal, navigation } = portfolio;
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-[var(--color-bg)] border-b-2 border-[var(--color-border)] text-white px-6 fixed top-0 w-full z-20">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-20">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
          <div className="w-8 h-8 relative">
            <Image src="/img/logo.png" alt="DAZ Logo" fill style={{ objectFit: 'contain' }} />
          </div>
          <span className="text-xl font-black tracking-tighter hidden sm:inline">{personal.name}</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-12">
          {navigation.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className="text-sm font-bold tracking-wide text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition uppercase"
            >
              {item.label}
            </Link>
          ))}
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
        <div className="md:hidden bg-[var(--color-bg-secondary)] border-t-2 border-[var(--color-border)] text-white p-6 space-y-4">
          {navigation.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className="block text-sm font-bold tracking-wide text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition uppercase"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;