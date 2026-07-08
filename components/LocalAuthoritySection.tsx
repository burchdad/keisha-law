'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const answers = [
  {
    question: 'Who does the firm help?',
    answer:
      'Rachal Law Firm APC helps families in Los Angeles County who need clear legal guidance for conservatorships, guardianships, probate, estate planning, name changes, and limited family law matters.',
  },
  {
    question: 'What makes the practice different?',
    answer:
      'Keisha Rachal brings more than three decades of paralegal experience in family law, probate, and estate planning to her work as an attorney, pairing practical system knowledge with focused legal guidance.',
  },
  {
    question: 'Are notarial services available?',
    answer:
      'Yes. Notarial services are offered by appointment for clients who need document notarization connected to their legal or personal planning needs.',
  },
];

export default function LocalAuthoritySection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent-gold">
            Los Angeles County Legal Guidance
          </p>
          <h2 className="mt-3 text-3xl font-serif font-light text-text md:text-4xl">
            Practical Answers for Families Facing Important Legal Decisions
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-text/75">
            The firm provides patient, organized support for families who need
            to protect loved ones, plan estates, administer probate matters, or
            complete court-guided family transitions.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {answers.map((item, index) => (
            <motion.article
              key={item.question}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="rounded-lg border border-accent-gold/15 bg-warm-ivory p-6"
            >
              <h3 className="font-serif text-xl font-semibold text-text">
                {item.question}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-text/75">
                {item.answer}
              </p>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/contact"
            className="inline-flex rounded-md bg-secondary px-6 py-3 font-medium text-muted-whites transition-colors hover:bg-accent-gold hover:text-primary"
          >
            Ask a Question
          </Link>
        </div>
      </div>
    </section>
  );
}
