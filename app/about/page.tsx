'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative py-32"
        style={{
          backgroundImage:
            `linear-gradient(rgba(15, 23, 32, 0.5), rgba(15, 23, 32, 0.5)), url('/background-image-2.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="max-w-4xl mx-auto relative px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif font-light text-muted-whites mb-6">
              About Attorney Keisha Law
            </h1>
            <p className="text-lg md:text-xl text-muted-whites/80 max-w-2xl mx-auto">
              Dedicated to providing compassionate legal guidance with over 25 years of experience serving the Los Angeles community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-warm-ivory">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Portrait */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="aspect-square bg-gradient-to-br from-secondary to-primary rounded-lg overflow-hidden shadow-2xl">
                {/* Placeholder for attorney portrait */}
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-accent-gold text-6xl opacity-50">
                    👩‍⚖️
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-serif font-light text-text mb-6">
                A Commitment to Compassionate Legal Service
              </h2>
              <div className="space-y-4 text-text/80 leading-relaxed">
                <p>
                  Attorney Keisha Law has dedicated her career to helping families navigate some of life's most challenging legal situations.
                  With over 25 years of experience in family law, estate planning, and probate matters, she brings both expertise and empathy to every case.
                </p>
                <p>
                  Licensed to practice in California, Attorney Law has served the Los Angeles and View Park communities since 2003,
                  building a reputation for thorough preparation, clear communication, and genuine care for her clients' well-being.
                </p>
                <p>
                  Her boutique practice allows for personalized attention to each client's unique circumstances,
                  ensuring that no detail is overlooked and every question is answered with patience and clarity.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Philosophy */}
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
                "Legal matters often arise during life's most difficult moments. My approach is rooted in the belief that
                everyone deserves guidance that combines professional expertise with genuine compassion. I listen first,
                understand deeply, and provide clear, actionable solutions that prioritize your family's well-being."
              </p>
              <p>
                "Trust is earned through transparency, consistency, and care. I believe in building lasting relationships
                with my clients, not just handling cases. Your peace of mind is my highest priority."
              </p>
            </div>
          </motion.div>

          {/* Experience & Qualifications */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
          >
            <div className="bg-primary rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-accent-gold mb-2">25+</div>
              <div className="text-muted-whites font-medium">Years of Experience</div>
            </div>
            <div className="bg-secondary rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-muted-whites mb-2">1000+</div>
              <div className="text-muted-whites/80 font-medium">Families Helped</div>
            </div>
          </motion.div>

          {/* CTA */}
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
              Contact our office to schedule a compassionate consultation.
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