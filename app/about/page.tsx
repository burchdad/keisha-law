'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen">
      <section className="relative py-32 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif font-light text-muted-whites mb-6">
              About Attorney Keisha Rachal
            </h1>
            <p className="text-lg md:text-xl text-muted-whites/80 max-w-2xl mx-auto">
              Dedicated to providing legal guidance with 30+ years of experience serving the Los Angeles community.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-warm-ivory">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-3xl font-serif font-light text-text mb-6">
                A Commitment to Legal Service
              </h2>
              <div className="space-y-4 text-text/80 leading-relaxed">
                <p>
                  With 30+ years in family law, estate planning, and probate as a paralegal before being admitted to practice law &mdash; Keisha Rachal offers something uncommon: the seasoned, in-the-trenches knowledge of a longtime legal professional.
                </p>
                <p>
                  She serves families across the County Los Angeles with thorough preparation, clear communication, and genuine care. Her boutique practice means every client gets personalized attention, every detail gets considered, and every question gets answered with patience and clarity.
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-lg p-8 shadow-lg border border-accent-gold/10 mb-16"
          >
            <h3 className="text-2xl font-serif font-light text-text mb-6 text-center">
              Our Philosophy
            </h3>
            <div className="space-y-4 text-text/70 leading-relaxed text-center max-w-3xl mx-auto">
              <p>
                &ldquo;Legal matters often arise during life&apos;s most difficult moments. My approach is rooted in the belief that everyone deserves guidance that combines professional expertise with genuine compassion. I listen first, understand deeply, and provide clear, actionable solutions that prioritize your family&apos;s well-being.&rdquo;
              </p>
              <p>
                &ldquo;Trust is earned through transparency, consistency, and care. I believe in building lasting relationships with my clients, not just handling cases. Your peace of mind is my highest priority.&rdquo;
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 mb-16"
          >
            <div className="bg-primary rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-accent-gold mb-2">30+</div>
              <div className="text-muted-whites font-medium">Years of Experience</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-2xl font-serif font-light text-text mb-4">
              Ready to Work With Us?
            </h3>
            <p className="text-text/70 mb-8">
              Contact our office to schedule a consultation.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-secondary text-muted-whites px-8 py-4 rounded-md hover:bg-accent-gold hover:text-primary transition-colors font-medium"
            >
              Schedule Consultation
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
