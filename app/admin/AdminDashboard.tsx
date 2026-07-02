'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
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

type TabKey = 'overview' | 'home' | 'about' | 'contact' | 'support' | 'export';

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

const tabs: { key: TabKey; label: string; helper: string }[] = [
  { key: 'overview', label: 'Overview', helper: 'Status and next steps' },
  { key: 'home', label: 'Home Page', helper: 'Hero and meet section' },
  { key: 'about', label: 'About Page', helper: 'Bio and philosophy copy' },
  { key: 'contact', label: 'Contact Details', helper: 'Office information' },
  { key: 'support', label: 'Support Helper', helper: 'Ghost handoff setup' },
  { key: 'export', label: 'Export Payload', helper: 'Review raw JSON' },
];

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
        className="mt-2 w-full resize-y rounded-md border border-accent-gold/20 bg-primary/70 px-4 py-3 text-sm leading-relaxed text-muted-whites outline-none transition focus:border-accent-gold"
      />
    </label>
  );
}

function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-accent-gold/20 bg-secondary/35">
      <div className="border-b border-accent-gold/15 px-6 py-5">
        <h2 className="font-serif text-2xl font-light">{title}</h2>
        <p className="mt-1 text-sm text-muted-whites/65">{description}</p>
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

export default function AdminDashboard() {
  const [content, setContent] = useState(initialContent);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
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
    <main className="min-h-screen bg-primary text-muted-whites">
      <div className="grid min-h-screen lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="border-b border-accent-gold/15 bg-primary/95 px-4 py-6 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
          <div className="mb-6 px-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent-gold">
              Website Admin
            </p>
            <h1 className="mt-2 font-serif text-2xl font-light">
              Content Dashboard
            </h1>
            <p className="mt-2 text-sm text-muted-whites/60">
              Manage site copy and support requests.
            </p>
          </div>

          <nav className="grid gap-2" aria-label="Admin sections">
            {tabs.map((tab) => {
              const isActive = tab.key === activeTab;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`rounded-md px-3 py-3 text-left transition-colors ${
                    isActive
                      ? 'bg-accent-gold text-primary'
                      : 'text-muted-whites/80 hover:bg-secondary/60 hover:text-muted-whites'
                  }`}
                >
                  <span className="block text-sm font-semibold">{tab.label}</span>
                  <span
                    className={`mt-1 block text-xs ${
                      isActive ? 'text-primary/75' : 'text-muted-whites/50'
                    }`}
                  >
                    {tab.helper}
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="mt-6 rounded-lg border border-accent-gold/20 bg-secondary/30 p-4 text-sm text-muted-whites/70">
            <p className="font-semibold text-muted-whites">Preview tools</p>
            <div className="mt-3 grid gap-2">
              <Link
                href="/"
                className="rounded-md border border-accent-gold/20 px-3 py-2 text-center transition hover:border-accent-gold hover:text-accent-gold"
              >
                View Site
              </Link>
              <button
                type="button"
                onClick={() => setActiveTab('export')}
                className="rounded-md border border-accent-gold/20 px-3 py-2 transition hover:border-accent-gold hover:text-accent-gold"
              >
                Review JSON
              </button>
            </div>
          </div>
        </aside>

        <section className="min-w-0 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 rounded-lg border border-accent-gold/20 bg-secondary/30 px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-accent-gold">
                Draft Mode
              </p>
              <p className="mt-1 text-sm text-muted-whites/70">
                Edits are staged here before they are sent to the support workflow.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setContent(initialContent);
                  setStatus('');
                }}
                className="rounded-md border border-accent-gold px-4 py-2 text-sm font-medium text-accent-gold transition hover:bg-accent-gold hover:text-primary"
              >
                Reset Draft
              </button>
              <button
                type="button"
                onClick={submitChangeRequest}
                className="rounded-md bg-accent-gold px-4 py-2 text-sm font-medium text-primary transition hover:bg-accent-gold/90"
              >
                Send Change Request
              </button>
            </div>
          </div>

          {status && (
            <div className="mb-6 rounded-md border border-accent-gold/30 bg-secondary/40 px-4 py-3 text-sm">
              {status}
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="grid gap-6 xl:grid-cols-3">
              <Panel
                title="Dashboard Overview"
                description="Quick access to the areas the client can update."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  {tabs
                    .filter((tab) => tab.key !== 'overview')
                    .map((tab) => (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveTab(tab.key)}
                        className="rounded-md border border-accent-gold/20 bg-primary/50 p-4 text-left transition hover:border-accent-gold"
                      >
                        <span className="block font-semibold">{tab.label}</span>
                        <span className="mt-1 block text-sm text-muted-whites/60">
                          {tab.helper}
                        </span>
                      </button>
                    ))}
                </div>
              </Panel>

              <Panel
                title="Website Support"
                description="Ghost Mission Control handoff status."
              >
                <div className="space-y-4 text-sm text-muted-whites/70">
                  <p>
                    Requests are prepared for the website helper workflow. Add
                    the webhook URL in Vercel as
                    <span className="font-mono text-accent-gold">
                      {' '}
                      GHOST_MISSION_CONTROL_WEBHOOK_URL
                    </span>
                    .
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('support')}
                    className="rounded-md bg-accent-gold px-4 py-2 font-medium text-primary"
                  >
                    Configure Helper
                  </button>
                </div>
              </Panel>

              <Panel
                title="Current Draft"
                description="Raw change payload preview."
              >
                <pre className="max-h-72 overflow-auto rounded-md bg-primary/80 p-4 text-xs leading-relaxed text-muted-whites/75">
                  {payload}
                </pre>
              </Panel>
            </div>
          )}

          {activeTab === 'home' && (
            <Panel
              title="Home Page"
              description="Edit hero copy, the floating trust card, and the meet section."
            >
              <div className="grid gap-5 xl:grid-cols-2">
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
                <div className="xl:col-span-2">
                  <Field
                    label="Hero body"
                    value={content.hero.body}
                    onChange={(value) => updatePath(['hero', 'body'], value)}
                  />
                </div>
                <div className="xl:col-span-2">
                  <Field
                    label="Floating trust card quote"
                    value={content.trustCard.quote}
                    onChange={(value) =>
                      updatePath(['trustCard', 'quote'], value)
                    }
                  />
                </div>
                <div className="xl:col-span-2">
                  <Field
                    label="Meet section paragraph 1"
                    rows={5}
                    value={content.homeAbout.paragraphs[0]}
                    onChange={(value) =>
                      updatePath(['homeAbout', 'paragraphs', '0'], value)
                    }
                  />
                </div>
                <div className="xl:col-span-2">
                  <Field
                    label="Meet section paragraph 2"
                    rows={4}
                    value={content.homeAbout.paragraphs[1]}
                    onChange={(value) =>
                      updatePath(['homeAbout', 'paragraphs', '1'], value)
                    }
                  />
                </div>
              </div>
            </Panel>
          )}

          {activeTab === 'about' && (
            <Panel
              title="About Page"
              description="Edit the attorney profile and supporting about-page copy."
            >
              <div className="grid gap-5">
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
            </Panel>
          )}

          {activeTab === 'contact' && (
            <Panel
              title="Contact Details"
              description="Update firm information, office hours, and notary messaging."
            >
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
                <div className="md:col-span-2">
                  <Field
                    label="Notary note"
                    rows={2}
                    value={content.contact.notaryNote}
                    onChange={(value) =>
                      updatePath(['contact', 'notaryNote'], value)
                    }
                  />
                </div>
              </div>
            </Panel>
          )}

          {activeTab === 'support' && (
            <Panel
              title="Support Helper"
              description="Configure how the website helper routes requests into Ghost Mission Control."
            >
              <div className="grid gap-5">
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
            </Panel>
          )}

          {activeTab === 'export' && (
            <Panel
              title="Export Payload"
              description="Review the exact JSON payload that will be sent with change requests."
            >
              <pre className="max-h-[calc(100vh-18rem)] overflow-auto rounded-md bg-primary/80 p-5 text-xs leading-relaxed text-muted-whites/80">
                {payload}
              </pre>
            </Panel>
          )}
        </section>
      </div>
    </main>
  );
}
