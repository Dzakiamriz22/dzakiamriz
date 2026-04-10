'use client';

import { useState } from 'react';
import Link from 'next/link';
import portfolio from '@/data/portfolio';

const Navbar = () => {
  const { personal, navigation } = portfolio;
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-900 text-white p-4 fixed top-0 w-full z-20 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo / Brand */}
        <div className="text-white text-2xl font-semibold tracking-wide">
          <Link href="/">{personal.name}</Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="text-gray-300 hover:text-white transition-all duration-300 ease-in-out">
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="md:hidden">
          <button 
            className="text-gray-300 hover:text-white transition-all duration-300 ease-in-out"
            onClick={toggleMenu}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-900 text-white p-4 space-y-4 transform transition-all duration-300 ease-in-out">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="block text-gray-300 hover:text-white transition-all duration-300 ease-in-out">
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;