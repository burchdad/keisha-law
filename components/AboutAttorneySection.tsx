'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AboutAttorneySection() {
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
              Meet Attorney Keisha Law
            </h2>

            <div className="space-y-4 text-muted-whites/90 leading-relaxed">
              <p>
                With 30+ years of dedicated service to the Los Angeles County, Attorney Keisha Law has built her practice on the foundation of integrity and unwavering commitment to her clients&apos; well-being.
              </p>

              <p>
                Understanding that legal matters often arise during life&apos;s most challenging moments, she approaches each case with the empathy and professionalism that families deserve. Her boutique practice focuses on providing personalized attention and clear guidance through complex legal situations.
              </p>

              <p>
                &ldquo;My philosophy is simple: every client deserves to feel heard, understood, and supported throughout their legal journey. I believe in building lasting relationships based on trust, transparency, and genuine care for the people I serve.&rdquo;
              </p>
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
