import { legalPolicyEffectiveDate, legalPolicyIntro, legalPolicySections } from '../lib/legalPolicies';

export default function LegalPolicyPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="min-h-screen bg-warm-ivory">
      <section className="bg-primary py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl font-light text-muted-whites md:text-5xl">
            {title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-whites/80">
            {description}
          </p>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-accent-gold">
            Effective Date: {legalPolicyEffectiveDate}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-accent-gold/15 bg-white p-6 shadow-sm md:p-10">
            <p className="text-base leading-relaxed text-text/80">
              {legalPolicyIntro}
            </p>

            <div className="mt-10 space-y-10">
              {legalPolicySections.map((section, index) => (
                <section key={section.title}>
                  <h2 className="font-serif text-2xl font-semibold text-text">
                    {index + 1}. {section.title}
                  </h2>
                  <div className="mt-4 space-y-4 text-sm leading-7 text-text/75 md:text-base">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    {section.bullets && (
                      <ul className="list-disc space-y-2 pl-6">
                        {section.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

