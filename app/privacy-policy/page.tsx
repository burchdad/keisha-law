import type { Metadata } from 'next';
import LegalPolicyPage from '../../components/LegalPolicyPage';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Privacy Policy for Rachal Law Firm APC, including data collection, use, security, communications, and website disclaimers.',
  alternates: {
    canonical: '/privacy-policy',
  },
};

export default function PrivacyPolicy() {
  return (
    <LegalPolicyPage
      title="Privacy Policy"
      description="How Rachal Law Firm APC handles information submitted through this website and related communications."
    />
  );
}

