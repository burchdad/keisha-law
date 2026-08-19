'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEditableSiteContent } from '../lib/editableSiteContent';

export default function AboutAttorneySection() {
  const { siteCopy } = useEditableSiteContent();

  return (
    <section className="relative py-20 overflow-hidden">
      <Image
        src="/background-image-2.png"
        alt="Attorney consultation setting"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-primary/70" />
      <div className="max-w-7xl mx-auto relative px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mx-auto w-full max-w-sm"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-accent-gold/30 shadow-2xl">
              <Image
                src="/keisha-rachal-headshot.png"
                alt="Attorney Keisha Rachal"
                fill
                sizes="(max-width: 1024px) 80vw, 360px"
                className="object-cover"
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center lg:text-left"
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
