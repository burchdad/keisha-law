import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Attorney Keisha Rachal',
  description:
    'Learn about Keisha Rachal and Rachal Law Firm APC, serving Los Angeles County families with estate planning, probate, conservatorship, and related legal guidance.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
