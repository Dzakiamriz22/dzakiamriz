'use client';

import { useState } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-900 text-white p-4 fixed top-0 w-full z-20 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo / Brand */}
        <div className="text-white text-2xl font-semibold tracking-wide">
          <Link href="/">Dzaki Amri Zaidaan</Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          <Link href="#about" className="text-gray-300 hover:text-white transition-all duration-300 ease-in-out">
            About
          </Link>
          <Link href="#projects" className="text-gray-300 hover:text-white transition-all duration-300 ease-in-out">
            Projects
          </Link>
          <Link href="#contact" className="text-gray-300 hover:text-white transition-all duration-300 ease-in-out">
            Contact
          </Link>
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
          <Link href="#about" className="block text-gray-300 hover:text-white transition-all duration-300 ease-in-out">
            About
          </Link>
          <Link href="#projects" className="block text-gray-300 hover:text-white transition-all duration-300 ease-in-out">
            Projects
          </Link>
          <Link href="#contact" className="block text-gray-300 hover:text-white transition-all duration-300 ease-in-out">
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;