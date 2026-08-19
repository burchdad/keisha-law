import type { Metadata } from 'next';
import LegalPolicyPage from '../../components/LegalPolicyPage';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms of Service and legal disclaimer for Rachal Law Firm APC website users.',
  alternates: {
    canonical: '/terms-of-service',
  },
};

export default function TermsOfService() {
  return (
    <LegalPolicyPage
      title="Terms of Service"
      description="Terms, conditions, and legal disclaimers for use of the Rachal Law Firm APC website."
    />
  );
}

