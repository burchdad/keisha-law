'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ContactCTASection() {
  return (
    <section className="py-20 bg-warm-ivory">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-serif font-light text-text mb-6">
            Ready to Take the Next Step?
          </h2>
          <p className="text-lg text-text/80 mb-8 max-w-2xl mx-auto">
            Contact our office for a consultation. We're here to listen and provide the guidance you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-secondary text-muted-whites px-8 py-4 rounded-md hover:bg-accent-gold hover:text-primary transition-colors font-medium"
            >
              Schedule Consultation
            </Link>
            <a
              href="tel:213-297-7642"
              className="border-2 border-secondary text-secondary px-8 py-4 rounded-md hover:bg-secondary hover:text-muted-whites transition-colors font-medium"
            >
              Call (213) 297-7642
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}