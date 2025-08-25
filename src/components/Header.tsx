"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-white">
            InstaSave
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-white/90 hover:text-white transition-colors duration-200"
            >
              Instagram Downloader
            </Link>
            <Link 
              href="/private" 
              className="text-white/90 hover:text-white transition-colors duration-200"
            >
              Private Downloader
            </Link>
            <Link 
              href="/help" 
              className="text-white/90 hover:text-white transition-colors duration-200"
            >
              Help
            </Link>
            
            {/* Language Selector */}
            <select className="bg-white/10 text-white border border-white/20 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-white/50">
              <option value="en" className="text-black">English</option>
              <option value="es" className="text-black">Español</option>
              <option value="fr" className="text-black">Français</option>
              <option value="de" className="text-black">Deutsch</option>
            </select>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:text-white/80 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-white/90 hover:text-white transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Instagram Downloader
              </Link>
              <Link 
                href="/private" 
                className="text-white/90 hover:text-white transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Private Downloader
              </Link>
              <Link 
                href="/help" 
                className="text-white/90 hover:text-white transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Help
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
