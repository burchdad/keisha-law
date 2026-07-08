import type { Metadata } from 'next';
import { practiceAreas } from '../../../lib/siteContent';

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }> | { slug: string };
};

export async function generateMetadata({
  params,
}: {
  params: LayoutProps['params'];
}): Promise<Metadata> {
  const resolvedParams = await params;
  const area = practiceAreas.find(
    (practiceArea) =>
      practiceArea.href === `/practice-areas/${resolvedParams.slug}`
  );

  if (!area) {
    return {
      title: 'Practice Area',
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  return {
    title: `${area.title} Attorney in Long Beach`,
    description: `${area.description} Rachal Law Firm APC serves Los Angeles County families from Long Beach, California.`,
    alternates: {
      canonical: area.href,
    },
    openGraph: {
      title: `${area.title} | Rachal Law Firm APC`,
      description: area.description,
      url: `https://www.krachallaw.com${area.href}`,
      images: [
        {
          url: area.imgSrc,
          alt: area.imgAlt,
        },
      ],
    },
  };
}

export default function PracticeAreaLayout({ children }: LayoutProps) {
  return children;
}
