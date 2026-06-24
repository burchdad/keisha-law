'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

const practiceAreas = [
  {
    title: 'Conservatorships',
    description: 'Compassionate guidance through conservatorship proceedings to protect vulnerable family members.',
    href: '/practice-areas/conservatorships',
    imgSrc: '/conservatorship.png',
    imgAlt: 'Conservatorship legal guidance image',
  },
  {
    title: 'Guardianships',
    description: 'Supportive legal assistance for establishing guardianship arrangements with care and expertise.',
    href: '/practice-areas/guardianships',
    imgSrc: '/guardianship.png',
    imgAlt: 'Guardianship legal guidance image',
  },
  {
    title: 'Estate Planning',
    description: 'Peace of mind through comprehensive estate planning and legacy protection services.',
    href: '/practice-areas/estate-planning',
    imgSrc: '/estate-planning.png',
    imgAlt: 'Estate planning legal image',
  },
  {
    title: 'Probate Matters',
    description: 'Clarity and guidance during probate proceedings to ensure smooth estate administration.',
    href: '/practice-areas/probate-matters',
    imgSrc: '/probate-matters.png',
    imgAlt: 'Probate matters legal image',
  },
  {
    title: 'Name Changes',
    description: 'Empowering support for legal name changes with sensitivity and professionalism.',
    href: '/practice-areas/name-changes',
    imgSrc: '/name-changes.png',
    imgAlt: 'Name change legal image',
  },
  {
    title: 'Limited Family Law',
    description: 'Calm resolution of family law matters with guidance focused on positive outcomes.',
    href: '/practice-areas/limited-family-law',
    imgSrc: '/limited-family-law.png',
    imgAlt: 'Family law guidance image',
  },
];

export default function PracticeAreaGrid() {
  return (
    <section className="py-20 bg-warm-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-light text-text mb-4">
            Legal Services Tailored to Your Needs
          </h2>
          <p className="text-lg text-text/80 max-w-2xl mx-auto">
            Professional legal guidance for life&apos;s most important moments, delivered with expertise.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {practiceAreas.map((area, index) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-white shadow-lg rounded-lg overflow-hidden border border-accent-gold/10 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <Image
                  src={area.imgSrc}
                  alt={area.imgAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/10 to-transparent" />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-serif font-semibold text-text mb-3">
                  {area.title}
                </h3>
                <p className="text-text/70 mb-4 leading-relaxed">
                  {area.description}
                </p>
                <Link
                  href={area.href}
                  className="inline-flex items-center text-secondary hover:text-accent-gold transition-colors font-medium"
                >
                  Learn More
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
