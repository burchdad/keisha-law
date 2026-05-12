'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Initial Consultation',
    description: 'We begin with a compassionate conversation to understand your unique situation and legal needs.',
  },
  {
    number: '02',
    title: 'Case Assessment',
    description: 'Thorough review of your documents and circumstances to develop a clear legal strategy.',
  },
  {
    number: '03',
    title: 'Documentation & Filing',
    description: 'Precise preparation and filing of all necessary legal documents with the court.',
  },
  {
    number: '04',
    title: 'Ongoing Guidance',
    description: 'Continuous support and communication throughout the legal process.',
  },
  {
    number: '05',
    title: 'Resolution',
    description: 'Successful completion of your legal matter with peace of mind.',
  },
];

export default function ProcessGuidanceSection() {
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
            Your Legal Journey With Us
          </h2>
          <p className="text-lg text-text/80 max-w-2xl mx-auto">
            A clear, compassionate process designed to reduce uncertainty and provide peace of mind.
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden lg:block absolute top-24 left-1/2 transform -translate-x-1/2 w-full max-w-4xl h-0.5 bg-accent-gold/30"></div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative text-center"
              >
                <div className="bg-white shadow-lg rounded-lg p-6 border border-accent-gold/10 hover:shadow-xl transition-shadow duration-300">
                  <div className="w-12 h-12 bg-secondary text-muted-whites rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-serif font-semibold text-text mb-3">
                    {step.title}
                  </h3>
                  <p className="text-text/70 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Timeline dot for desktop */}
                <div className="hidden lg:block absolute top-24 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-accent-gold rounded-full border-4 border-white"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}