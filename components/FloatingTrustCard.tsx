'use client';

import { motion } from 'framer-motion';

export default function FloatingTrustCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative -mt-16 mb-16 mx-auto max-w-2xl bg-secondary shadow-2xl rounded-lg p-8 text-center border border-accent-gold/20"
    >
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
        <div className="w-8 h-8 bg-secondary border border-accent-gold/20 rotate-45"></div>
      </div>
      <p className="text-lg md:text-xl text-muted-whites leading-relaxed">
        &ldquo;Helping Families Navigate Difficult Legal Matters With Compassion, Clarity, And Experience.&rdquo;
      </p>
      <div className="mt-4 w-16 h-1 bg-accent-gold mx-auto rounded-full"></div>
    </motion.div>
  );
}
