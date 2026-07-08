import { contactInfo, firmLinks, practiceAreas } from '../lib/siteContent';

const baseUrl = 'https://www.krachallaw.com';

export default function StructuredData() {
  const legalServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    '@id': `${baseUrl}/#legalservice`,
    name: contactInfo.firmName,
    url: baseUrl,
    telephone: contactInfo.phoneDisplay,
    email: contactInfo.email,
    image: `${baseUrl}/hero-bg.png`,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '3520 Long Beach Blvd., Suite 204',
      addressLocality: 'Long Beach',
      addressRegion: 'CA',
      postalCode: '90807',
      addressCountry: 'US',
    },
    areaServed: [
      {
        '@type': 'AdministrativeArea',
        name: 'Los Angeles County',
      },
      {
        '@type': 'City',
        name: 'Long Beach',
      },
      {
        '@type': 'City',
        name: 'Los Angeles',
      },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '17:00',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Legal and notarial services',
      itemListElement: [
        ...practiceAreas.map((area) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: area.title,
            description: area.description,
            url: `${baseUrl}${area.href}`,
          },
        })),
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Notarial services by appointment',
            description: contactInfo.notaryNote,
            url: `${baseUrl}/contact`,
          },
        },
      ],
    },
    sameAs: [firmLinks.payment, firmLinks.clientPortal],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What legal services does Rachal Law Firm APC provide?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Rachal Law Firm APC assists with conservatorships, guardianships, estate planning, probate matters, name changes, limited family law matters, and notarial services by appointment.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where does Rachal Law Firm APC serve clients?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The firm serves families across Los Angeles County from its office in Long Beach, California.',
        },
      },
      {
        '@type': 'Question',
        name: 'How can someone request a consultation?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Prospective clients can request a consultation through the contact form or call the office at (213) 297-7642.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(legalServiceSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
    </>
  );
}
