import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Rachal Law Firm APC',
  description:
    'Contact Rachal Law Firm APC in Long Beach to request a consultation for conservatorships, probate, estate planning, name changes, limited family law, or notarial services by appointment.',
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
