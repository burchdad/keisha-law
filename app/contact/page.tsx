'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { CONTACT_LIMITS } from '../../lib/contact-fields';
import { createContactRequest, contactWasAccepted } from '../../lib/contact-client';
import { useEditableSiteContent } from '../../lib/editableSiteContent';

// Build-time cutover gate. Existing production behavior stays on Formspree by default.
const usesResend = process.env.NEXT_PUBLIC_CONTACT_PROVIDER === 'resend';

export default function Contact() {
  const { contactInfo, siteCopy } = useEditableSiteContent();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    practiceArea: '',
    message: '',
    website: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const inFlight = useRef(false);
  const submissionId = useRef<string | null>(null);
  const activeRequest = useRef<AbortController | null>(null);
  const feedback = useRef<HTMLDivElement | null>(null);

  useEffect(() => () => activeRequest.current?.abort(), []);
  useEffect(() => {
    if (submitSuccess || submitError) feedback.current?.focus();
  }, [submitSuccess, submitError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError('');
    const controller = new AbortController();
    activeRequest.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 55000);

    try {
      submissionId.current ??= crypto.randomUUID();
      const { url, payload } = createContactRequest(formData, submissionId.current, usesResend);
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        signal: controller.signal,
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => null);
      if (contactWasAccepted(response.ok, result, usesResend)) {
        setSubmitSuccess(true);
        setFormData({ name: '', email: '', phone: '', practiceArea: '', message: '', website: '' });
        submissionId.current = null;
      } else {
        setSubmitError(result?.saved === true
          ? 'Your inquiry was saved, but we could not confirm that our office was notified. Please call our office.'
          : response.status === 429
          ? 'Too many attempts. Please wait ten minutes or call our office.'
          : response.status === 400
            ? 'Please check your entries and try again.'
            : 'We could not confirm your inquiry was submitted. Please retry or call our office.');
      }
    } catch {
      // Keep the form and retry ID: a timeout does not establish whether delivery was accepted.
      setSubmitError('We could not confirm your inquiry was submitted. Please retry or call our office.');
    } finally {
      window.clearTimeout(timeout);
      activeRequest.current = null;
      inFlight.current = false;
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    submissionId.current = null;
    setSubmitSuccess(false);
    setSubmitError('');
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif font-light text-muted-whites mb-6">
              {siteCopy.contactPage.heroHeading}
            </h1>

            <p className="text-lg md:text-xl text-muted-whites/80 max-w-2xl mx-auto">
              {siteCopy.contactPage.heroBody}
            </p>
          </motion.div>
        </div>
      </section>

      {/* What Happens Next */}
      <section className="py-20 bg-warm-ivory">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-light text-text mb-6">
              What Happens Next
            </h2>

            <p className="text-lg text-text/80">
              Your journey to resolution begins with a simple conversation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-secondary text-muted-whites rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                1
              </div>

              <h3 className="text-lg font-serif font-semibold text-text mb-2">
                Submit Inquiry
              </h3>

              <p className="text-text/70">
                Fill out the form below or call our office to start the
                conversation.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-secondary text-muted-whites rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                2
              </div>

              <h3 className="text-lg font-serif font-semibold text-text mb-2">
                Case Review
              </h3>

              <p className="text-text/70">
                Our office reviews your situation and prepares for your
                consultation.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-secondary text-muted-whites rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                3
              </div>

              <h3 className="text-lg font-serif font-semibold text-text mb-2">
                Legal Guidance Begins
              </h3>

              <p className="text-text/70">
                Schedule your consultation and begin receiving legal support.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-serif font-light text-text mb-8">
                Get In Touch
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-text mb-2">
                    Office Address
                  </h3>

                  <p className="text-text/70">
                    {contactInfo.addressLine1}
                    <br />
                    {contactInfo.addressLine2}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text mb-2">
                    Phone
                  </h3>

                  <p className="text-text/70">
                    <a
                      href={contactInfo.phoneHref}
                      className="hover:text-secondary transition-colors"
                    >
                      {contactInfo.phoneDisplay}
                    </a>
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text mb-2">
                    Facsimile
                  </h3>

                  <p className="text-text/70">
                    {contactInfo.fax}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text mb-2">
                    Email
                  </h3>

                  <p className="text-text/70">
                    <a
                      href={contactInfo.emailHref}
                      className="hover:text-secondary transition-colors"
                    >
                      {contactInfo.email}
                    </a>
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text mb-2">
                    Office Hours
                  </h3>

                  <div className="text-text/70 space-y-1">
                    <p>{contactInfo.weekdayHours}</p>
                    <p>{contactInfo.saturdayHours}</p>
                    <p>{contactInfo.sundayHours}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text mb-2">
                    Notary Public
                  </h3>

                  <p className="text-text/70">
                    {contactInfo.notaryNote}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <form
                onSubmit={handleSubmit}
                aria-busy={isSubmitting}
                className="bg-warm-ivory rounded-lg p-8 shadow-lg"
              >
                <div ref={feedback} tabIndex={-1} aria-live="polite" aria-atomic="true">
                  {submitSuccess && (
                    <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-md">
                      Your inquiry has been submitted for delivery. If your matter
                      is time-sensitive, please call our office.
                    </div>
                  )}

                  {submitError && (
                    <div role="alert" className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-md">
                      {submitError}
                    </div>
                  )}

                </div>
                <fieldset disabled={isSubmitting} className="space-y-6 mt-6 min-w-0">
                  <legend className="sr-only">Contact inquiry</legend>
                  <div aria-hidden="true" className="absolute -left-[10000px] top-auto w-px h-px overflow-hidden">
                    <label htmlFor="website">Leave this field empty</label>
                    <input id="website" name="website" type="text" tabIndex={-1}
                      autoComplete="off" maxLength={200} value={formData.website} onChange={handleChange} />
                  </div>

                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-text mb-2"
                    >
                      Full Name *
                    </label>

                    <input
                      type="text"
                      id="name"
                      name="name"
                      autoComplete="name"
                      maxLength={CONTACT_LIMITS.name}
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-accent-gold/20 rounded-md bg-white text-text placeholder:text-text/45 focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-text mb-2"
                    >
                      Email Address *
                    </label>

                    <input
                      type="email"
                      id="email"
                      name="email"
                      autoComplete="email"
                      maxLength={CONTACT_LIMITS.email}
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-accent-gold/20 rounded-md bg-white text-text placeholder:text-text/45 focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-text mb-2"
                    >
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      autoComplete="tel"
                      maxLength={CONTACT_LIMITS.phone}
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-accent-gold/20 rounded-md bg-white text-text placeholder:text-text/45 focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="practiceArea"
                      className="block text-sm font-medium text-text mb-2"
                    >
                      Practice Area of Interest
                    </label>

                    <select
                      id="practiceArea"
                      name="practiceArea"
                      value={formData.practiceArea}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-accent-gold/20 rounded-md bg-white text-text focus:outline-none focus:ring-2 focus:ring-secondary"
                    >
                      <option value="">Select a practice area</option>
                      <option value="conservatorships">
                        Conservatorships
                      </option>
                      <option value="guardianships">Guardianships</option>
                      <option value="estate-planning">
                        Estate Planning
                      </option>
                      <option value="probate-matters">
                        Probate Matters
                      </option>
                      <option value="name-changes">Name Changes</option>
                      <option value="limited-family-law">
                        Limited Family Law
                      </option>
                      <option value="notarial-services">
                        Notarial Services
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-text mb-2"
                    >
                      Message *
                    </label>

                    <textarea
                      id="message"
                      name="message"
                      maxLength={CONTACT_LIMITS.message}
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please describe your legal matter..."
                      className="w-full px-4 py-3 border border-accent-gold/20 rounded-md bg-white text-text placeholder:text-text/45 focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-secondary text-muted-whites py-4 px-6 rounded-md hover:bg-accent-gold hover:text-primary transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </fieldset>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
