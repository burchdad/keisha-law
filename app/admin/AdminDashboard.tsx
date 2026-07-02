'use client';

import { useMemo, useState } from 'react';
import { contactInfo, siteCopy } from '../../lib/siteContent';

type EditableContent = typeof siteCopy & {
  contact: typeof contactInfo;
  support: {
    helperName: string;
    missionControlEndpoint: string;
    supportSummary: string;
  };
};

const initialContent: EditableContent = {
  ...siteCopy,
  contact: contactInfo,
  support: {
    helperName: 'Rachal Law Website Helper',
    missionControlEndpoint: 'GHOST_MISSION_CONTROL_WEBHOOK_URL',
    supportSummary:
      'Website support helper agent for routing client text edits and website support requests into Ghost Mission Control.',
  },
};

function Field({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-muted-whites/80">{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-md border border-accent-gold/20 bg-primary/70 px-4 py-3 text-muted-whites outline-none transition focus:border-accent-gold"
      />
    </label>
  );
}

export default function AdminDashboard() {
  const [content, setContent] = useState(initialContent);
  const [status, setStatus] = useState('');
  const payload = useMemo(() => JSON.stringify(content, null, 2), [content]);

  const updatePath = (path: string[], value: string) => {
    setContent((current) => {
      const copy = structuredClone(current);
      let target: Record<string, unknown> = copy;

      path.slice(0, -1).forEach((key) => {
        target = target[key] as Record<string, unknown>;
      });

      target[path[path.length - 1]] = value;
      return copy;
    });
  };

  const submitChangeRequest = async () => {
    setStatus('Sending update request...');

    const response = await fetch('/api/admin/content', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    });

    const result = await response.json().catch(() => null);

    if (response.ok) {
      setStatus(
        result?.message ?? 'Update request sent to the website support workflow.'
      );
      return;
    }

    setStatus(
      result?.message ??
        'Content exported below. Connect Ghost Mission Control to accept live edits.'
    );
  };

  return (
    <main className="min-h-screen bg-primary pt-24 text-muted-whites">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-accent-gold">
              Website Admin
            </p>
            <h1 className="font-serif text-4xl font-light">
              Content Dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-muted-whites/75">
              Edit key website copy, prepare client-safe change requests, and
              route support work to the Ghost Mission Control helper workflow.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setContent(initialContent)}
              className="rounded-md border border-accent-gold px-5 py-3 font-medium text-accent-gold transition hover:bg-accent-gold hover:text-primary"
            >
              Reset Draft
            </button>
            <button
              type="button"
              onClick={submitChangeRequest}
              className="rounded-md bg-accent-gold px-5 py-3 font-medium text-primary transition hover:bg-accent-gold/90"
            >
              Send Change Request
            </button>
          </div>
        </div>

        {status && (
          <div className="mb-8 rounded-md border border-accent-gold/30 bg-secondary/40 px-4 py-3 text-sm">
            {status}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-8">
            <section className="rounded-lg border border-accent-gold/20 bg-secondary/35 p-6">
              <h2 className="mb-5 font-serif text-2xl">Home Page</h2>
              <div className="space-y-5">
                <Field
                  label="Hero headline line 1"
                  rows={2}
                  value={content.hero.headlineLine1}
                  onChange={(value) =>
                    updatePath(['hero', 'headlineLine1'], value)
                  }
                />
                <Field
                  label="Hero headline line 2"
                  rows={2}
                  value={content.hero.headlineLine2}
                  onChange={(value) =>
                    updatePath(['hero', 'headlineLine2'], value)
                  }
                />
                <Field
                  label="Hero body"
                  value={content.hero.body}
                  onChange={(value) => updatePath(['hero', 'body'], value)}
                />
                <Field
                  label="Floating trust card quote"
                  value={content.trustCard.quote}
                  onChange={(value) =>
                    updatePath(['trustCard', 'quote'], value)
                  }
                />
                <Field
                  label="Meet section paragraph 1"
                  rows={5}
                  value={content.homeAbout.paragraphs[0]}
                  onChange={(value) =>
                    updatePath(['homeAbout', 'paragraphs', '0'], value)
                  }
                />
                <Field
                  label="Meet section paragraph 2"
                  rows={4}
                  value={content.homeAbout.paragraphs[1]}
                  onChange={(value) =>
                    updatePath(['homeAbout', 'paragraphs', '1'], value)
                  }
                />
              </div>
            </section>

            <section className="rounded-lg border border-accent-gold/20 bg-secondary/35 p-6">
              <h2 className="mb-5 font-serif text-2xl">About Page</h2>
              <div className="space-y-5">
                <Field
                  label="About hero body"
                  value={content.aboutPage.heroBody}
                  onChange={(value) =>
                    updatePath(['aboutPage', 'heroBody'], value)
                  }
                />
                <Field
                  label="Story paragraph 1"
                  rows={5}
                  value={content.aboutPage.storyParagraphs[0]}
                  onChange={(value) =>
                    updatePath(['aboutPage', 'storyParagraphs', '0'], value)
                  }
                />
                <Field
                  label="Story paragraph 2"
                  rows={4}
                  value={content.aboutPage.storyParagraphs[1]}
                  onChange={(value) =>
                    updatePath(['aboutPage', 'storyParagraphs', '1'], value)
                  }
                />
              </div>
            </section>

            <section className="rounded-lg border border-accent-gold/20 bg-secondary/35 p-6">
              <h2 className="mb-5 font-serif text-2xl">Contact Details</h2>
              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Firm name"
                  rows={2}
                  value={content.contact.firmName}
                  onChange={(value) =>
                    updatePath(['contact', 'firmName'], value)
                  }
                />
                <Field
                  label="Phone"
                  rows={2}
                  value={content.contact.phoneDisplay}
                  onChange={(value) =>
                    updatePath(['contact', 'phoneDisplay'], value)
                  }
                />
                <Field
                  label="Address line 1"
                  rows={2}
                  value={content.contact.addressLine1}
                  onChange={(value) =>
                    updatePath(['contact', 'addressLine1'], value)
                  }
                />
                <Field
                  label="Address line 2"
                  rows={2}
                  value={content.contact.addressLine2}
                  onChange={(value) =>
                    updatePath(['contact', 'addressLine2'], value)
                  }
                />
                <Field
                  label="Notary note"
                  rows={2}
                  value={content.contact.notaryNote}
                  onChange={(value) =>
                    updatePath(['contact', 'notaryNote'], value)
                  }
                />
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <section className="rounded-lg border border-accent-gold/20 bg-secondary/35 p-6">
              <h2 className="mb-4 font-serif text-2xl">Support Helper</h2>
              <div className="space-y-5">
                <Field
                  label="Helper agent name"
                  rows={2}
                  value={content.support.helperName}
                  onChange={(value) =>
                    updatePath(['support', 'helperName'], value)
                  }
                />
                <Field
                  label="Ghost Mission Control endpoint env"
                  rows={2}
                  value={content.support.missionControlEndpoint}
                  onChange={(value) =>
                    updatePath(['support', 'missionControlEndpoint'], value)
                  }
                />
                <Field
                  label="Support summary"
                  rows={4}
                  value={content.support.supportSummary}
                  onChange={(value) =>
                    updatePath(['support', 'supportSummary'], value)
                  }
                />
              </div>
            </section>

            <section className="rounded-lg border border-accent-gold/20 bg-secondary/35 p-6">
              <h2 className="mb-4 font-serif text-2xl">Export Payload</h2>
              <pre className="max-h-[520px] overflow-auto rounded-md bg-primary/80 p-4 text-xs leading-relaxed text-muted-whites/80">
                {payload}
              </pre>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
