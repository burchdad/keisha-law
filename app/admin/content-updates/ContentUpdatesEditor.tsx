'use client';

import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { siteCopy } from '../../../lib/siteContent';

type ContentDraft = {
  heroHeadlineLine1: string;
  heroHeadlineLine2: string;
  heroBody: string;
  trustCardQuote: string;
  servicesHeading: string;
  servicesBody: string;
  meetHeading: string;
  meetParagraph1: string;
  meetParagraph2: string;
  aboutHeroBody: string;
  aboutStoryParagraph1: string;
  aboutStoryParagraph2: string;
  contactHeroBody: string;
  footerDescription: string;
};

const initialDraft: ContentDraft = {
  heroHeadlineLine1: siteCopy.hero.headlineLine1,
  heroHeadlineLine2: siteCopy.hero.headlineLine2,
  heroBody: siteCopy.hero.body,
  trustCardQuote: siteCopy.trustCard.quote,
  servicesHeading: siteCopy.servicesIntro.heading,
  servicesBody: siteCopy.servicesIntro.body,
  meetHeading: siteCopy.homeAbout.heading,
  meetParagraph1: siteCopy.homeAbout.paragraphs[0],
  meetParagraph2: siteCopy.homeAbout.paragraphs[1],
  aboutHeroBody: siteCopy.aboutPage.heroBody,
  aboutStoryParagraph1: siteCopy.aboutPage.storyParagraphs[0],
  aboutStoryParagraph2: siteCopy.aboutPage.storyParagraphs[1],
  contactHeroBody: siteCopy.contactPage.heroBody,
  footerDescription: siteCopy.footer.description,
};

function TextInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted-whites/45">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-md border border-white/10 bg-black/30 px-3 text-sm font-medium text-muted-whites outline-none transition focus:border-accent-gold"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted-whites/45">
        {label}
      </span>
      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full resize-y rounded-md border border-white/10 bg-black/30 px-3 py-3 text-sm leading-relaxed text-muted-whites outline-none transition focus:border-accent-gold"
      />
    </label>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-black/35">
      <div className="border-b border-white/10 px-5 py-4">
        <h2 className="text-sm font-black uppercase tracking-wide">{title}</h2>
      </div>
      <div className="grid gap-5 p-5">{children}</div>
    </section>
  );
}

export default function ContentUpdatesEditor() {
  const [draft, setDraft] = useState(initialDraft);
  const [status, setStatus] = useState('');
  const payload = useMemo(() => JSON.stringify(draft, null, 2), [draft]);

  const updateDraft = <Key extends keyof ContentDraft>(
    key: Key,
    value: ContentDraft[Key]
  ) => {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const saveDraft = () => {
    window.localStorage.setItem('rachal-law-content-draft', payload);
    setStatus('Content draft saved in this dashboard. No support ticket was created.');
  };

  return (
    <>
      <header className="rounded-lg border border-white/10 bg-black/40 p-5">
        <p className="text-xs font-black uppercase tracking-[0.26em] text-accent-gold">
          Content CMS
        </p>
        <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight">
              Content Updates
            </h1>
            <p className="mt-2 text-sm text-muted-whites/60">
              Edit public website copy directly from the dashboard.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setDraft(initialDraft);
                setStatus('');
              }}
              className="rounded-md border border-accent-gold/40 px-4 py-2 text-sm font-bold text-accent-gold"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={saveDraft}
              className="rounded-md bg-accent-gold px-4 py-2 text-sm font-bold text-primary"
            >
              Save Changes
            </button>
          </div>
        </div>
      </header>

      {status && (
        <div className="mt-5 rounded-md border border-accent-gold/30 bg-accent-gold/10 px-4 py-3 text-sm font-semibold text-accent-gold">
          {status}
        </div>
      )}

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Section title="Home Hero">
          <div className="grid gap-5 md:grid-cols-2">
            <TextInput
              label="Headline Line 1"
              value={draft.heroHeadlineLine1}
              onChange={(value) => updateDraft('heroHeadlineLine1', value)}
            />
            <TextInput
              label="Headline Line 2"
              value={draft.heroHeadlineLine2}
              onChange={(value) => updateDraft('heroHeadlineLine2', value)}
            />
          </div>
          <TextArea
            label="Hero Body"
            value={draft.heroBody}
            onChange={(value) => updateDraft('heroBody', value)}
          />
          <TextArea
            label="Floating Trust Card"
            value={draft.trustCardQuote}
            onChange={(value) => updateDraft('trustCardQuote', value)}
          />
        </Section>

        <Section title="Services Intro">
          <TextInput
            label="Heading"
            value={draft.servicesHeading}
            onChange={(value) => updateDraft('servicesHeading', value)}
          />
          <TextArea
            label="Body"
            value={draft.servicesBody}
            onChange={(value) => updateDraft('servicesBody', value)}
          />
        </Section>

        <Section title="Meet Section">
          <TextInput
            label="Heading"
            value={draft.meetHeading}
            onChange={(value) => updateDraft('meetHeading', value)}
          />
          <TextArea
            label="Paragraph 1"
            rows={5}
            value={draft.meetParagraph1}
            onChange={(value) => updateDraft('meetParagraph1', value)}
          />
          <TextArea
            label="Paragraph 2"
            rows={4}
            value={draft.meetParagraph2}
            onChange={(value) => updateDraft('meetParagraph2', value)}
          />
        </Section>

        <Section title="About Page">
          <TextArea
            label="Hero Body"
            value={draft.aboutHeroBody}
            onChange={(value) => updateDraft('aboutHeroBody', value)}
          />
          <TextArea
            label="Story Paragraph 1"
            rows={5}
            value={draft.aboutStoryParagraph1}
            onChange={(value) => updateDraft('aboutStoryParagraph1', value)}
          />
          <TextArea
            label="Story Paragraph 2"
            rows={4}
            value={draft.aboutStoryParagraph2}
            onChange={(value) => updateDraft('aboutStoryParagraph2', value)}
          />
        </Section>

        <Section title="Contact and Footer">
          <TextArea
            label="Contact Hero Body"
            value={draft.contactHeroBody}
            onChange={(value) => updateDraft('contactHeroBody', value)}
          />
          <TextArea
            label="Footer Description"
            value={draft.footerDescription}
            onChange={(value) => updateDraft('footerDescription', value)}
          />
        </Section>

        <Section title="Saved Payload Preview">
          <pre className="max-h-96 overflow-auto rounded-md bg-black/40 p-4 text-xs leading-relaxed text-muted-whites/65">
            {payload}
          </pre>
        </Section>
      </div>
    </>
  );
}
