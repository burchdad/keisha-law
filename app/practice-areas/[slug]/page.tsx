'use client';

import { use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface PracticeAreaData {
  title: string;
  subtitle: string;
  heroDescription: string;
  heroImage: string;
  heroImageAlt: string;
  emotionalPositioning: string;
  educationalContent: {
    title: string;
    content: string[];
  };
  process: {
    title: string;
    steps: string[];
  };
  whyMatters: string;
  faqs: {
    question: string;
    answer: string;
  }[];
}

const practiceAreas: Record<string, PracticeAreaData> = {
  'conservatorships': {
    title: 'Conservatorships',
    subtitle: 'Protecting Vulnerable Family Members',
    heroImage: '/conservatorship.png',
    heroImageAlt: 'Conservatorship consultation with family and attorney',
    heroDescription: 'Compassionate guidance through conservatorship proceedings to ensure the safety and well-being of loved ones who need protection.',
    emotionalPositioning: 'When a family member can no longer make decisions for themselves, establishing a conservatorship provides the legal framework to ensure their care and protection. This process, while necessary, can be emotionally challenging. We guide you through it with sensitivity and expertise.',
    educationalContent: {
      title: 'Understanding Conservatorships',
      content: [
        'A conservatorship is a legal arrangement where a court appoints someone to manage the affairs of another person who is unable to do so themselves. This could be due to age, illness, disability, or other circumstances that impair decision-making capacity.',
        'Conservatorships can involve different types of authority: conservatorship of the person (making healthcare and personal decisions) and conservatorship of the estate (managing financial affairs).',
        'The process begins with filing a petition with the court, followed by medical evaluations, court hearings, and ongoing responsibilities once appointed.',
        'Our approach focuses on minimizing family conflict while ensuring the protected person receives appropriate care and their rights are respected.'
      ]
    },
    process: {
      title: 'The Conservatorship Process',
      steps: [
        'Initial consultation to assess the situation and determine if conservatorship is appropriate',
        'Filing the petition with the appropriate court',
        'Medical and professional evaluations as required by law',
        'Court hearing where evidence is presented and decisions are made',
        'Appointment and bonding as conservator',
        'Ongoing responsibilities including annual accountings and court reports'
      ]
    },
    whyMatters: 'Conservatorships matter because they provide legal protection and ensure that vulnerable individuals receive the care they need. Without proper legal oversight, important decisions about healthcare, living arrangements, and finances could be made inappropriately or not at all.',
    faqs: [
      {
        question: 'What is the difference between a conservatorship and guardianship?',
        answer: 'While similar, conservatorships typically involve adults who have lost capacity due to illness or injury, while guardianships usually involve minors. The terms are sometimes used interchangeably in different jurisdictions.'
      },
      {
        question: 'How long does a conservatorship last?',
        answer: 'Conservatorships can be temporary or permanent, depending on the circumstances. Many are reviewed periodically by the court to determine if they should continue.'
      },
      {
        question: 'Can family members serve as conservators?',
        answer: 'Yes, family members are often appointed as conservators. The court prioritizes the best interests of the protected person when making this decision.'
      }
    ]
  },
  'guardianships': {
    title: 'Guardianships',
    subtitle: 'Safeguarding Family Futures',
    heroImage: '/guardianship.png',
    heroImageAlt: 'Attorney guiding family through guardianship paperwork',
    heroDescription: 'Supportive legal assistance for establishing guardianship arrangements that protect children and ensure their well-being.',
    emotionalPositioning: 'Creating a guardianship means stepping in to provide stability and protection for a child during uncertain times. Whether due to parental incapacity, adoption, or other circumstances, we help establish these arrangements with care and legal precision.',
    educationalContent: {
      title: 'Understanding Guardianships',
      content: [
        'A guardianship is a legal relationship where an adult is appointed by the court to make decisions for a minor child. This can involve personal decisions (healthcare, education) and/or financial decisions.',
        'Guardianships may be needed when parents are unable to care for their children due to illness, incarceration, military service, or other reasons.',
        'The process involves filing a petition, court evaluation, and ongoing responsibilities to ensure the child\'s best interests are served.',
        'We work to make this process as smooth as possible while prioritizing the child\'s safety and well-being.'
      ]
    },
    process: {
      title: 'The Guardianship Process',
      steps: [
        'Assessment of the child\'s needs and family circumstances',
        'Filing the guardianship petition with the court',
        'Home study and background checks as required',
        'Court hearing to review the petition and appoint guardian',
        'Legal documentation and court orders',
        'Ongoing responsibilities including annual reports to the court'
      ]
    },
    whyMatters: 'Guardianships provide essential legal protection for children who need adult guidance and decision-making. They ensure that children have stable, responsible adults making important decisions about their healthcare, education, and overall well-being.',
    faqs: [
      {
        question: 'When is a guardianship needed?',
        answer: 'Guardianships are typically needed when a child\'s parents are unable or unwilling to provide care, or when additional legal protection is required for the child\'s well-being.'
      },
      {
        question: 'Can guardians make all decisions for the child?',
        answer: 'Guardians have authority over personal and/or financial decisions as specified by the court order. Some decisions may still require court approval.'
      },
      {
        question: 'How does guardianship differ from adoption?',
        answer: 'Guardianship provides legal authority to make decisions for a child without terminating parental rights, while adoption creates a permanent parent-child relationship.'
      }
    ]
  },
  'estate-planning': {
    title: 'Estate Planning',
    subtitle: 'Securing Your Legacy',
    heroImage: '/estate-planning.png',
    heroImageAlt: 'Couple reviewing estate planning documents with attorney',
    heroDescription: 'Peace of mind through comprehensive estate planning that protects your family and preserves your wishes for the future.',
    emotionalPositioning: 'Estate planning is about more than documents—it\'s about ensuring your loved ones are protected and your wishes are honored. We help you create a comprehensive plan that provides security and peace of mind for you and your family.',
    educationalContent: {
      title: 'Understanding Estate Planning',
      content: [
        'Estate planning involves creating legal documents that specify how your assets will be distributed and your affairs managed after your passing.',
        'Key components include wills, trusts, powers of attorney, and healthcare directives.',
        'Proper planning can minimize taxes, avoid probate delays, and ensure your wishes are carried out exactly as intended.',
        'We take time to understand your family dynamics and goals to create a personalized plan.'
      ]
    },
    process: {
      title: 'The Estate Planning Process',
      steps: [
        'Comprehensive consultation to understand your goals and family situation',
        'Review of your assets and current estate plan (if any)',
        'Creation of customized estate planning documents',
        'Legal review and execution of documents',
        'Storage and organization of important documents',
        'Periodic review and updates as needed'
      ]
    },
    whyMatters: 'Estate planning matters because it ensures your assets go where you want them to go, protects your family from unnecessary stress and expense, and provides clear guidance during difficult times.',
    faqs: [
      {
        question: 'Do I need a will?',
        answer: 'While not everyone needs a will, having one ensures your assets are distributed according to your wishes and can help avoid family disputes and unnecessary costs.'
      },
      {
        question: 'What\'s the difference between a will and a trust?',
        answer: 'A will is a legal document that distributes assets after death, while a trust can manage assets during life and after death, often avoiding probate.'
      },
      {
        question: 'How often should I update my estate plan?',
        answer: 'Major life changes (marriage, divorce, children, significant assets) should trigger a review. We recommend reviewing every 3-5 years.'
      }
    ]
  },
  'probate-matters': {
    title: 'Probate Matters',
    subtitle: 'Clarity During Transitions',
    heroImage: '/probate-matters.png',
    heroImageAlt: 'Probate attorney reviewing estate paperwork with clients',
    heroDescription: 'Guidance through probate proceedings that brings clarity and resolution during difficult times of loss and transition.',
    emotionalPositioning: 'Losing a loved one is never easy, and dealing with probate matters can add stress during an already difficult time. We provide compassionate, clear guidance to help you navigate this process with confidence.',
    educationalContent: {
      title: 'Understanding Probate',
      content: [
        'Probate is the legal process of administering a deceased person\'s estate, including validating the will, paying debts, and distributing assets.',
        'Not all estates require probate—small estates or those with trusts may avoid the process.',
        'The probate process typically takes 9-18 months and involves court supervision.',
        'Our role is to guide you through each step, explain options, and advocate for efficient resolution.'
      ]
    },
    process: {
      title: 'The Probate Process',
      steps: [
        'Filing the petition to open probate with the court',
        'Notice to heirs and creditors as required by law',
        'Inventory and appraisal of estate assets',
        'Payment of debts, taxes, and final expenses',
        'Distribution of remaining assets to beneficiaries',
        'Final accounting and closing of the estate'
      ]
    },
    whyMatters: 'Probate matters because it provides legal protection and ensures proper distribution of assets. Without proper administration, estates can become complicated, costly, and contentious.',
    faqs: [
      {
        question: 'What is probate?',
        answer: 'Probate is the court-supervised process of administering a deceased person\'s estate, including validating the will and distributing assets.'
      },
      {
        question: 'How long does probate take?',
        answer: 'Probate typically takes 9-18 months, though simple estates may resolve faster and complex ones may take longer.'
      },
      {
        question: 'Do all estates go through probate?',
        answer: 'No, estates under certain dollar amounts may qualify for simplified procedures, and assets in trusts often avoid probate entirely.'
      }
    ]
  },
  'name-changes': {
    title: 'Name Changes',
    subtitle: 'New Beginnings, Fresh Start',
    heroImage: '/name-changes.png',
    heroImageAlt: 'New name change paperwork and family support',
    heroDescription: 'Empowering support for legal name changes that mark new chapters in life with dignity and legal precision.',
    emotionalPositioning: 'A name change represents a significant life transition—whether for personal reasons, marriage, divorce, or other circumstances. We handle this process with the sensitivity and respect it deserves.',
    educationalContent: {
      title: 'Understanding Name Changes',
      content: [
        'Legal name changes require court approval and involve filing a petition with valid reasons for the change.',
        'Common reasons include marriage, divorce, gender transition, or personal preference.',
        'The process includes publishing notice of the petition and attending a court hearing.',
        'Once approved, you\'ll receive a court order that can be used to update identification and records.'
      ]
    },
    process: {
      title: 'The Name Change Process',
      steps: [
        'Consultation to discuss reasons and prepare the petition',
        'Filing the name change petition with the court',
        'Publishing legal notice as required by law',
        'Court hearing to present your case',
        'Receiving the court order approving the name change',
        'Updating identification, records, and accounts with new name'
      ]
    },
    whyMatters: 'Name changes matter because they allow individuals to live authentically and move forward from past circumstances. The legal process ensures proper documentation and protection of rights.',
    faqs: [
      {
        question: 'What are valid reasons for a name change?',
        answer: 'Valid reasons include marriage, divorce, gender transition, religious conversion, or any reason that serves a legitimate interest and doesn\'t intend to defraud.'
      },
      {
        question: 'How long does a name change take?',
        answer: 'The process typically takes 2-6 months, depending on court schedules and whether publication is required.'
      },
      {
        question: 'Can I change my name for any reason?',
        answer: 'While many reasons are acceptable, courts may deny requests that appear fraudulent or could cause confusion/harm.'
      }
    ]
  },
  'limited-family-law': {
    title: 'Limited Family Law',
    subtitle: 'Calm Resolution, Peaceful Solutions',
    heroImage: '/limited-family-law.png',
    heroImageAlt: 'Family law consultation with compassionate attorney',
    heroDescription: 'Guidance through family law matters with a focus on resolution, understanding, and protecting what matters most.',
    emotionalPositioning: 'Family conflicts can be among life\'s most challenging experiences. We approach these matters with compassion, seeking resolutions that prioritize family relationships and long-term well-being.',
    educationalContent: {
      title: 'Understanding Family Law Matters',
      content: [
        'Family law encompasses legal issues affecting family relationships, including divorce, child custody, support, and domestic partnerships.',
        'Our limited practice focuses on providing guidance for specific family law situations.',
        'We prioritize amicable resolutions and work to minimize conflict where possible.',
        'Each case is handled with sensitivity to the emotional aspects involved.'
      ]
    },
    process: {
      title: 'Family Law Guidance Process',
      steps: [
        'Initial consultation to understand your situation and goals',
        'Review of relevant documents and legal options',
        'Development of strategy focused on your best interests',
        'Negotiation and mediation when appropriate',
        'Court representation if litigation becomes necessary',
        'Ongoing support through resolution and implementation'
      ]
    },
    whyMatters: 'Family law matters affect the core of our lives—our relationships, children, and future security. Professional guidance ensures fair outcomes and protects important rights.',
    faqs: [
      {
        question: 'What family law matters do you handle?',
        answer: 'We provide guidance for specific family law situations including certain divorce matters, child custody arrangements, and related legal issues.'
      },
      {
        question: 'Do you handle divorce cases?',
        answer: 'We handle limited divorce matters. Complex or contested divorces may require referral to specialists in that area.'
      },
      {
        question: 'How do you approach family law cases?',
        answer: 'We prioritize amicable resolutions and work to minimize conflict, focusing on practical solutions that serve family interests.'
      }
    ]
  }
};

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export default function PracticeAreaPage({ params }: PageProps) {
  const resolvedParams =
    typeof (params as Promise<{ slug: string }>).then === 'function'
      ? use(params as Promise<{ slug: string }>)
      : (params as { slug: string });

  const slug = resolvedParams.slug;
  const data = practiceAreas[slug];

  if (!data) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-warm-ivory px-4">
      <div className="text-center">
        <h1 className="text-4xl font-serif text-text mb-4">
          Practice Area Not Found
        </h1>
        <p className="text-text/70 mb-6">
          The practice area you are looking for could not be found.
        </p>
        <Link
          href="/"
          className="inline-block bg-secondary text-muted-whites px-6 py-3 rounded-md hover:bg-accent-gold hover:text-primary transition-colors"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative py-32"
        style={{
          backgroundImage:
            `linear-gradient(rgba(15, 23, 32, 0.5), rgba(15, 23, 32, 0.5)), url('${data.heroImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="max-w-4xl mx-auto relative px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif font-light text-muted-whites mb-4">
              {data.title}
            </h1>
            <p className="text-lg md:text-xl text-muted-whites/80 mb-2">
              {data.subtitle}
            </p>
            <p className="text-lg text-muted-whites/70 max-w-2xl mx-auto">
              {data.heroDescription}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Floating Trust Card */}
      <FloatingTrustCard message={data.emotionalPositioning} />

      {/* Educational Content */}
      <section className="py-20 bg-warm-ivory">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-light text-text mb-8 text-center">
              {data.educationalContent.title}
            </h2>
            <div className="space-y-6 text-text/80 leading-relaxed">
              {data.educationalContent.content.map((paragraph, index) => (
                <p key={index} className="text-lg">
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-light text-text mb-4">
              {data.process.title}
            </h2>
          </motion.div>

          <div className="space-y-4">
            {data.process.steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start space-x-4 bg-warm-ivory p-6 rounded-lg"
              >
                <div className="w-8 h-8 bg-secondary text-muted-whites rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-text/80 leading-relaxed">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-light text-muted-whites mb-8">
              Why Legal Guidance Matters
            </h2>
            <p className="text-lg md:text-xl text-muted-whites/80 max-w-3xl mx-auto leading-relaxed">
              {data.whyMatters}
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-warm-ivory">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-light text-text mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-6">
            {data.faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-lg border border-accent-gold/10"
              >
                <h3 className="text-lg font-serif font-semibold text-text mb-3">
                  {faq.question}
                </h3>
                <p className="text-text/70 leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-light text-text mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-text/80 mb-8 max-w-2xl mx-auto">
              Contact our office for compassionate guidance through your {data.title.toLowerCase()} matter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-secondary text-muted-whites px-8 py-4 rounded-md hover:bg-accent-gold hover:text-primary transition-colors font-medium"
              >
                Schedule Consultation
              </Link>
              <a
                href="tel:213-297-7642"
                className="border-2 border-secondary text-secondary px-8 py-4 rounded-md hover:bg-secondary hover:text-muted-whites transition-colors font-medium"
              >
                Call (213) 297-7642
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-serif font-light text-muted-whites mb-4">
            Need Immediate Assistance?
          </h3>
          <p className="text-muted-whites/80 mb-6">
            Our office is here to help you navigate this process with compassion and expertise.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-accent-gold text-primary px-6 py-3 rounded-md hover:bg-accent-gold/90 transition-colors font-medium"
          >
            Contact Us Today
          </Link>
        </div>
      </section>
    </div>
  );
}

function FloatingTrustCard({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative -mt-16 mb-16 mx-auto max-w-2xl bg-secondary shadow-2xl rounded-lg p-8 text-center border border-accent-gold/20"
    >
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
        <div className="w-8 h-8 bg-secondary border border-accent-gold/20 rotate-45"></div>
      </div>
      <p className="text-lg md:text-xl text-muted-whites leading-relaxed">
        {message}
      </p>
      <div className="mt-4 w-16 h-1 bg-accent-gold mx-auto rounded-full"></div>
    </motion.div>
  );
}