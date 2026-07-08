'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Initial Consultation',
    description:
      'We begin with a conversation to understand your unique situation and legal needs.',
  },
  {
    number: '02',
    title: 'Case Assessment',
    description:
      'Thorough review of your documents and circumstances to develop a clear legal strategy.',
  },
  {
    number: '03',
    title: 'Documentation & Filing',
    description:
      'Precise preparation and filing of all necessary legal documents with the court.',
  },
  {
    number: '04',
    title: 'Ongoing Guidance',
    description:
      'Continuous support and communication throughout the legal process.',
  },
  {
    number: '05',
    title: 'Resolution',
    description:
      'Successful completion of your legal matter with peace of mind.',
  },
];

export default function ProcessGuidanceSection() {
  return (
    <section className="py-20 bg-warm-ivory overflow-hidden">
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
            A clear process designed to reduce uncertainty and
            provide peace of mind.
          </p>
        </motion.div>

        <div className="relative">
          {/* Desktop timeline line */}
          <div className="hidden lg:block absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-5xl h-px bg-accent-gold/35" />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative flex flex-col items-center text-center"
              >
                {/* Number marker sits on the timeline */}
                <div className="relative z-20 w-14 h-14 bg-secondary text-muted-whites rounded-full flex items-center justify-center font-bold text-lg mb-8 shadow-md border-4 border-warm-ivory">
                  {step.number}
                </div>

                {/* Card sits below the timeline */}
                <div className="bg-white shadow-lg rounded-lg p-6 border border-accent-gold/10 hover:shadow-xl transition-shadow duration-300 min-h-[220px] w-full">
                  <h3 className="text-lg font-serif font-semibold text-text mb-3">
                    {step.title}
                  </h3>

                  <p className="text-text/70 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
