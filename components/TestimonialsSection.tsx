'use client';

import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "Attorney Law guided us through a difficult conservatorship with clarity and care. We felt truly supported every step of the way.",
    author: "Sarah M.",
    location: "Los Angeles, CA",
  },
  {
    quote: "The estate planning process was handled with such care and professionalism. Attorney Law made what could have been overwhelming feel manageable.",
    author: "Michael R.",
    location: "View Park, CA",
  },
  {
    quote: "During our family's probate matter, Attorney Law provided not just legal expertise, but genuine empathy. We're grateful for her guidance.",
    author: "Jennifer L.",
    location: "Los Angeles, CA",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-light text-muted-whites mb-4">
            Trusted by Families Like Yours
          </h2>
          <p className="text-lg text-muted-whites/80 max-w-2xl mx-auto">
            Real experiences from clients who found trusted legal guidance during difficult times.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-secondary rounded-lg p-6 shadow-lg border border-accent-gold/20"
            >
              <div className="mb-4">
                <svg className="w-8 h-8 text-accent-gold" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                </svg>
              </div>
              <blockquote className="text-muted-whites/90 mb-4 leading-relaxed italic">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <div className="text-accent-gold font-medium">
                {testimonial.author}
              </div>
              <div className="text-muted-whites/60 text-sm">
                {testimonial.location}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
