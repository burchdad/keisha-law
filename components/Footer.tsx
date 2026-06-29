'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-primary text-muted-whites">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-serif font-semibold text-accent-gold mb-4">Keisha Law</h3>
            <p className="text-sm text-muted-whites/80 mb-4">
              Helping families navigate difficult legal matters with compassion, clarity, and experience.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-secondary text-muted-whites px-6 py-3 rounded-md hover:bg-accent-gold hover:text-primary transition-colors font-medium"
            >
              Schedule Consultation
            </Link>
          </div>

          {/* Practice Areas */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Practice Areas</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/practice-areas/conservatorships" className="hover:text-accent-gold transition-colors">Conservatorships</Link></li>
              <li><Link href="/practice-areas/guardianships" className="hover:text-accent-gold transition-colors">Guardianships</Link></li>
              <li><Link href="/practice-areas/estate-planning" className="hover:text-accent-gold transition-colors">Estate Planning</Link></li>
              <li><Link href="/practice-areas/probate-matters" className="hover:text-accent-gold transition-colors">Probate Matters</Link></li>
              <li><Link href="/practice-areas/name-changes" className="hover:text-accent-gold transition-colors">Name Changes</Link></li>
              <li><Link href="/practice-areas/limited-family-law" className="hover:text-accent-gold transition-colors">Limited Family Law</Link></li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-accent-gold transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-accent-gold transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-accent-gold transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Information</h4>
            <div className="space-y-2 text-sm">
              <p>3520 Long Beach Blvd., Suite 204<br />Long Beach, CA 90807</p>
              <p>Phone: (213) 297-7642</p>
              <p>Fax: (562) 548-5078</p>
              <p>Email: info@krachallaw.com</p>
            </div>
            <div className="mt-4">
              <h5 className="font-semibold mb-2">Office Hours</h5>
              <p className="text-sm">Monday - Friday: 9AM - 5PM<br />Saturday: By Appointment<br />Sunday: Closed</p>
            </div>
            <p className="mt-4 text-sm text-muted-whites/80">
              Notarial services are also offered upon appointment.
            </p>
          </div>
        </div>

        <div className="border-t border-accent-gold/20 mt-8 pt-8 text-center text-sm text-muted-whites/60">
          <p>&copy; 2026 Keisha Law. All rights reserved. | Attorney Advertising | This website is for informational purposes only and does not constitute legal advice.</p>
        </div>
      </div>
    </footer>
  );
}
