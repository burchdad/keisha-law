import { contactInfo, practiceAreas } from '../lib/siteContent';

const baseUrl = 'https://www.krachallaw.com';

export default function StructuredData() {
  const legalServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    '@id': `${baseUrl}/#legalservice`,
    name: contactInfo.firmName,
    url: baseUrl,
    employee: { '@id': `${baseUrl}/#keisha-rachal` },
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
  };

  const attorneySchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${baseUrl}/#keisha-rachal`,
    name: 'Keisha Rachal',
    jobTitle: 'Attorney',
    url: `${baseUrl}/about`,
    image: `${baseUrl}/keisha-rachal-headshot.png`,
    worksFor: { '@id': `${baseUrl}/#legalservice` },
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
          __html: JSON.stringify(attorneySchema),
        }}
      />
    </>
  );
}
