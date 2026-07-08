'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEditableSiteContent } from '../lib/editableSiteContent';

export default function AboutAttorneySection() {
  const { siteCopy } = useEditableSiteContent();

  return (
    <section
      className="relative py-20"
      style={{
        backgroundImage:
          `linear-gradient(rgba(15, 23, 32, 0.6), rgba(15, 23, 32, 0.6)), url('/background-image-2.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-black/20" />
      <div className="max-w-7xl mx-auto relative px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-light text-muted-whites mb-6">
              {siteCopy.homeAbout.heading}
            </h2>

            <div className="space-y-4 text-muted-whites/90 leading-relaxed">
              {siteCopy.homeAbout.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-8">
              <Link
                href="/about"
                className="inline-block bg-secondary text-muted-whites px-6 py-3 rounded-md hover:bg-accent-gold hover:text-primary transition-colors font-medium"
              >
                Learn More About My Practice
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
