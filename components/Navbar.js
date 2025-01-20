'use client';

import { useState } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-900 text-white p-4 fixed top-0 w-full z-10 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-semibold tracking-wide">
          <Link href="/">Dzaki Amri Zaidaan</Link>
        </div>

        <div className="space-x-6 hidden md:flex">
          <Link href="#about" className="text-gray-300 hover:text-gray-100 transition-all duration-200">
            About
          </Link>
          <Link href="#projects" className="text-gray-300 hover:text-gray-100 transition-all duration-200">
            Projects
          </Link>
          <Link href="#contact" className="text-gray-300 hover:text-gray-100 transition-all duration-200">
            Contact
          </Link>
        </div>

        <div className="md:hidden">
          <button 
            className="text-gray-300 hover:text-gray-100 transition-all duration-200"
            onClick={toggleMenu}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gray-900 text-white p-4 space-y-4">
          <Link href="#about" className="block text-gray-300 hover:text-gray-100 transition-all duration-200">
            About
          </Link>
          <Link href="#projects" className="block text-gray-300 hover:text-gray-100 transition-all duration-200">
            Projects
          </Link>
          <Link href="#contact" className="block text-gray-300 hover:text-gray-100 transition-all duration-200">
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
