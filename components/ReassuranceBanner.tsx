'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ReassuranceBanner() {
  return (
    <section className="py-20 bg-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-muted-whites mb-8 leading-tight">
            You Don&apos;t Have To Navigate This Alone
          </h2>
          <p className="text-lg md:text-xl text-muted-whites/80 mb-8 max-w-2xl mx-auto">
            When life brings legal challenges, you deserve guidance that combines expertise with genuine compassion.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-accent-gold text-primary px-8 py-4 rounded-md hover:bg-accent-gold/90 transition-colors font-medium text-lg"
          >
            Get Started Today
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
