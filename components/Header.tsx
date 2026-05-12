'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Header() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-primary/90 backdrop-blur-md border-b border-accent-gold/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-serif font-semibold text-muted-whites hover:text-accent-gold transition-colors">
            Keisha Law
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-muted-whites hover:text-accent-gold transition-colors font-medium">
              Home
            </Link>
            <Link href="/about" className="text-muted-whites hover:text-accent-gold transition-colors font-medium">
              About
            </Link>
            <div className="relative group">
              <button className="text-muted-whites hover:text-accent-gold transition-colors font-medium flex items-center">
                Practice Areas
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 bg-secondary shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  <Link href="/practice-areas/conservatorships" className="block px-4 py-2 text-sm text-muted-whites hover:bg-primary hover:text-accent-gold">
                    Conservatorships
                  </Link>
                  <Link href="/practice-areas/guardianships" className="block px-4 py-2 text-sm text-muted-whites hover:bg-primary hover:text-accent-gold">
                    Guardianships
                  </Link>
                  <Link href="/practice-areas/estate-planning" className="block px-4 py-2 text-sm text-muted-whites hover:bg-primary hover:text-accent-gold">
                    Estate Planning
                  </Link>
                  <Link href="/practice-areas/probate-matters" className="block px-4 py-2 text-sm text-muted-whites hover:bg-primary hover:text-accent-gold">
                    Probate Matters
                  </Link>
                  <Link href="/practice-areas/name-changes" className="block px-4 py-2 text-sm text-muted-whites hover:bg-primary hover:text-accent-gold">
                    Name Changes
                  </Link>
                  <Link href="/practice-areas/limited-family-law" className="block px-4 py-2 text-sm text-muted-whites hover:bg-primary hover:text-accent-gold">
                    Limited Family Law
                  </Link>
                </div>
              </div>
            </div>
            <Link href="/contact" className="text-muted-whites hover:text-accent-gold transition-colors font-medium">
              Contact
            </Link>
          </nav>

          {/* Phone CTA */}
          <a
            href="tel:323-293-2321"
            className="bg-secondary text-muted-whites px-4 py-2 rounded-md hover:bg-accent-gold hover:text-primary transition-colors font-medium"
          >
            (323) 293-2321
          </a>

          {/* Mobile menu button */}
          <button className="md:hidden text-muted-whites">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </motion.header>
  );
}