'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEditableSiteContent } from '../../lib/editableSiteContent';

export default function About() {
  const { siteCopy } = useEditableSiteContent();

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
              {siteCopy.aboutPage.heroHeading}
            </h1>
            <p className="text-lg md:text-xl text-muted-whites/80 max-w-2xl mx-auto">
              {siteCopy.aboutPage.heroBody}
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
                {siteCopy.aboutPage.storyHeading}
              </h2>
              <div className="space-y-4 text-text/80 leading-relaxed">
                {siteCopy.aboutPage.storyParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
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
              {siteCopy.aboutPage.philosophyHeading}
            </h3>
            <div className="space-y-4 text-text/70 leading-relaxed text-center max-w-3xl mx-auto">
              {siteCopy.aboutPage.philosophyParagraphs.map((paragraph) => (
                <p key={paragraph}>&ldquo;{paragraph}&rdquo;</p>
              ))}
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
