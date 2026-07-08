'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { firmLinks } from '../lib/siteContent';
import { useEditableSiteContent } from '../lib/editableSiteContent';

const practiceAreaLinks = [
  { href: '/practice-areas/conservatorships', label: 'Conservatorships' },
  { href: '/practice-areas/guardianships', label: 'Guardianships' },
  { href: '/practice-areas/estate-planning', label: 'Estate Planning' },
  { href: '/practice-areas/probate-matters', label: 'Probate Matters' },
  { href: '/practice-areas/name-changes', label: 'Name Changes' },
  { href: '/practice-areas/limited-family-law', label: 'Limited Family Law' },
];

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [isPracticeMenuOpen, setIsPracticeMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { contactInfo } = useEditableSiteContent();

  const closeMenus = () => {
    setIsPracticeMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-primary/90 backdrop-blur-md border-b border-accent-gold/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            onClick={closeMenus}
            className="text-2xl font-serif font-semibold text-muted-whites hover:text-accent-gold transition-colors"
          >
            {contactInfo.firmName}
          </Link>

          <nav className="hidden md:flex space-x-8" aria-label="Primary">
            <Link
              href="/"
              className="text-muted-whites hover:text-accent-gold transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-muted-whites hover:text-accent-gold transition-colors font-medium"
            >
              About
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setIsPracticeMenuOpen(true)}
              onMouseLeave={() => setIsPracticeMenuOpen(false)}
            >
              <button
                type="button"
                aria-expanded={isPracticeMenuOpen}
                aria-controls="practice-areas-menu"
                onClick={() => setIsPracticeMenuOpen((isOpen) => !isOpen)}
                onFocus={() => setIsPracticeMenuOpen(true)}
                className="text-muted-whites hover:text-accent-gold transition-colors font-medium flex items-center"
              >
                Practice Areas
                <svg
                  className={`ml-1 w-4 h-4 transition-transform ${isPracticeMenuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                id="practice-areas-menu"
                className={`absolute top-full left-0 mt-2 w-56 bg-secondary shadow-lg rounded-md transition-all duration-200 ${
                  isPracticeMenuOpen
                    ? 'opacity-100 visible translate-y-0'
                    : 'opacity-0 invisible -translate-y-1'
                }`}
                onFocus={() => setIsPracticeMenuOpen(true)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setIsPracticeMenuOpen(false);
                  }
                }}
              >
                <div className="py-2">
                  {practiceAreaLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMenus}
                      className="block px-4 py-2 text-sm text-muted-whites hover:bg-primary hover:text-accent-gold focus:bg-primary focus:text-accent-gold focus:outline-none"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link
              href="/contact"
              className="text-muted-whites hover:text-accent-gold transition-colors font-medium"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={firmLinks.payment}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xl:inline-flex bg-accent-gold text-primary px-4 py-2 rounded-md hover:bg-accent-gold/90 transition-colors font-medium"
            >
              Payment Link
            </a>

            <a
              href={firmLinks.clientPortal}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xl:inline-flex border border-accent-gold text-accent-gold px-4 py-2 rounded-md hover:bg-accent-gold hover:text-primary transition-colors font-medium"
            >
              Client Portal Login
            </a>

            <a
              href={contactInfo.phoneHref}
              className="hidden sm:inline-flex bg-secondary text-muted-whites px-4 py-2 rounded-md hover:bg-accent-gold hover:text-primary transition-colors font-medium"
            >
              {contactInfo.phoneDisplay}
            </a>

            <button
              type="button"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
              className="md:hidden text-muted-whites hover:text-accent-gold transition-colors p-2 -mr-2"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        <nav
          id="mobile-navigation"
          aria-label="Mobile primary"
          className={`md:hidden overflow-hidden transition-all duration-200 ${
            isMobileMenuOpen ? 'max-h-[520px] pb-4' : 'max-h-0'
          }`}
        >
          <div className="border-t border-accent-gold/20 pt-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenus}
                className="block px-2 py-3 text-muted-whites hover:text-accent-gold transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
            <div className="px-2 pt-3 text-xs uppercase tracking-wide text-muted-whites/60">
              Practice Areas
            </div>
            {practiceAreaLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenus}
                className="block px-4 py-2 text-sm text-muted-whites/90 hover:text-accent-gold transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={contactInfo.phoneHref}
              className="mt-3 flex justify-center bg-secondary text-muted-whites px-4 py-3 rounded-md hover:bg-accent-gold hover:text-primary transition-colors font-medium"
            >
              {contactInfo.phoneDisplay}
            </a>
            <a
              href={firmLinks.payment}
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-center bg-accent-gold text-primary px-4 py-3 rounded-md hover:bg-accent-gold/90 transition-colors font-medium"
            >
              Payment Link
            </a>
            <a
              href={firmLinks.clientPortal}
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-center border border-accent-gold text-accent-gold px-4 py-3 rounded-md hover:bg-accent-gold hover:text-primary transition-colors font-medium"
            >
              Client Portal Login
            </a>
          </div>
        </nav>
      </div>
    </motion.header>
  );
}
