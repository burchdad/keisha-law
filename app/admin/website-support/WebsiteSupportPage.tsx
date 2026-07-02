'use client';

import { useMemo, useState } from 'react';
import { contactInfo, siteCopy } from '../../../lib/siteContent';

type Ticket = {
  id: string;
  title: string;
  type: string;
  priority: string;
  section: string;
  status: 'Sent' | 'Draft' | 'Retry Needed';
  createdAt: string;
  summary: string;
};

type TicketForm = {
  clientSite: string;
  section: string;
  requesterName: string;
  requesterEmail: string;
  requestType: string;
  priority: string;
  summary: string;
  details: string;
  acknowledged: boolean;
};

const contentPayload = {
  siteCopy,
  contactInfo,
};

const initialTickets: Ticket[] = [
  {
    id: 'KL-INTAKE-001',
    title: 'Update attorney bio wording',
    type: 'TEXT_UPDATE',
    priority: 'NORMAL',
    section: 'About Page',
    status: 'Sent',
    createdAt: 'Latest preview',
    summary: 'Clarify paralegal experience before attorney admission.',
  },
  {
    id: 'KL-INTAKE-002',
    title: 'Add notary appointment note',
    type: 'TEXT_UPDATE',
    priority: 'NORMAL',
    section: 'Contact Page',
    status: 'Sent',
    createdAt: 'Testing branch',
    summary: 'Add notarial services are offered by appointment.',
  },
  {
    id: 'KL-INTAKE-003',
    title: 'Prepare Ghost helper connection',
    type: 'INTEGRATION',
    priority: 'HIGH',
    section: 'Website Support',
    status: 'Draft',
    createdAt: 'Needs webhook',
    summary: 'Connect dashboard requests to Ghost Mission Control.',
  },
];

const initialForm: TicketForm = {
  clientSite: 'Rachal Law Firm APC',
  section: '/admin or describe page section',
  requesterName: '',
  requesterEmail: contactInfo.email,
  requestType: 'Text update',
  priority: 'Normal',
  summary: '',
  details: '',
  acknowledged: false,
};

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wide text-muted-whites/55">
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-md border border-muted-whites/10 bg-black/30 px-3 text-sm font-medium text-muted-whites outline-none transition placeholder:text-muted-whites/35 focus:border-accent-gold"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wide text-muted-whites/55">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-md border border-muted-whites/10 bg-black/30 px-3 text-sm font-medium text-muted-whites outline-none transition focus:border-accent-gold"
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-primary">
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function StatCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-lg border border-muted-whites/10 bg-black/25 p-5">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-whites/45">
        {label}
      </p>
      <p className="mt-3 text-4xl font-black text-muted-whites">{value}</p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-accent-gold">
        {note}
      </p>
    </div>
  );
}

export default function WebsiteSupportPage() {
  const [form, setForm] = useState<TicketForm>(initialForm);
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [status, setStatus] = useState('');
  const payload = useMemo(
    () =>
      JSON.stringify(
        {
          ticket: form,
          currentContent: contentPayload,
        },
        null,
        2
      ),
    [form]
  );

  const updateForm = <Key extends keyof TicketForm>(
    key: Key,
    value: TicketForm[Key]
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const submitTicket = async () => {
    if (!form.acknowledged) {
      setStatus('Please confirm this creates a support request before sending.');
      return;
    }

    setStatus('Sending ticket to website helper...');

    const response = await fetch('/api/web-helper/support', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    });

    const result = await response.json().catch(() => null);
    const ticketId = `KL-INTAKE-${Date.now()}`;

    setTickets((current) => [
      {
        id: ticketId,
        title: form.summary || 'Website update request',
        type: form.requestType.toUpperCase().replaceAll(' ', '_'),
        priority: form.priority.toUpperCase(),
        section: form.section,
        status: response.ok ? 'Sent' : 'Retry Needed',
        createdAt: 'Just now',
        summary: form.details || 'No extra details provided.',
      },
      ...current,
    ]);

    setStatus(
      result?.message ??
        'Ticket captured. Configure Ghost Mission Control to forward requests.'
    );
  };

  return (
    <>
      <header className="rounded-lg border border-white/10 bg-black/40 p-5">
        <p className="text-xs font-black uppercase tracking-[0.26em] text-accent-gold">
          Website Update Center
        </p>
        <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-muted-whites">
              Website Support
            </h1>
            <p className="mt-2 text-sm text-muted-whites/60">
              Create structured work tickets for Ghost Mission Control and the
              web helper agent.
            </p>
          </div>
          <div className="rounded-md border border-accent-gold/35 px-4 py-2 text-sm font-bold uppercase tracking-wide text-accent-gold">
            Testing Branch Active
          </div>
        </div>
      </header>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <StatCard
          label="Recent Tickets"
          value={String(tickets.length)}
          note="Captured here"
        />
        <StatCard
          label="Sent To Agents"
          value={String(tickets.filter((ticket) => ticket.status === 'Sent').length)}
          note="Ready for review"
        />
        <StatCard label="Webhook" value="Draft" note="Ghost handoff pending" />
      </div>

      {status && (
        <div className="mt-5 rounded-md border border-accent-gold/30 bg-accent-gold/10 px-4 py-3 text-sm font-semibold text-accent-gold">
          {status}
        </div>
      )}

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.18fr)_minmax(380px,0.82fr)]">
        <section className="rounded-lg border border-white/10 bg-black/35">
          <div className="border-b border-white/10 px-5 py-5">
            <h2 className="text-sm font-black uppercase tracking-wide">
              Website Helper Bot
            </h2>
            <p className="mt-2 text-sm text-muted-whites/55">
              Collect the request, attach context, and create a review-gated
              work ticket.
            </p>
          </div>

          <div className="space-y-5 p-5">
            <div className="rounded-md border border-cyan-400/25 bg-cyan-400/10 p-4">
              <p className="text-sm font-bold text-cyan-100">
                Website helper intake
              </p>
              <p className="mt-2 text-sm text-cyan-100/75">
                No changes are published automatically. Work stays on a testing
                branch until approved and merged.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Client / Site"
                value={form.clientSite}
                onChange={(value) => updateForm('clientSite', value)}
              />
              <Field
                label="Page or Section"
                value={form.section}
                onChange={(value) => updateForm('section', value)}
                placeholder="/services or homepage hero"
              />
              <Field
                label="Requester Name"
                value={form.requesterName}
                onChange={(value) => updateForm('requesterName', value)}
              />
              <Field
                label="Requester Email"
                type="email"
                value={form.requesterEmail}
                onChange={(value) => updateForm('requesterEmail', value)}
              />
              <SelectField
                label="Request Type"
                value={form.requestType}
                onChange={(value) => updateForm('requestType', value)}
                options={[
                  'Text update',
                  'Image update',
                  'New section',
                  'Bug',
                  'Integration',
                ]}
              />
              <SelectField
                label="Priority"
                value={form.priority}
                onChange={(value) => updateForm('priority', value)}
                options={['Normal', 'High', 'Urgent']}
              />
            </div>

            <Field
              label="Short Summary"
              value={form.summary}
              onChange={(value) => updateForm('summary', value)}
              placeholder="Replace services page hero image"
            />

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-muted-whites/55">
                Details for the Web Helper
              </span>
              <textarea
                value={form.details}
                rows={8}
                onChange={(event) => updateForm('details', event.target.value)}
                placeholder="Describe what should change, where it appears, and any exact copy/assets to use."
                className="mt-2 w-full resize-y rounded-md border border-muted-whites/10 bg-black/30 px-3 py-3 text-sm leading-relaxed text-muted-whites outline-none transition placeholder:text-muted-whites/35 focus:border-accent-gold"
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-muted-whites/55">
                Screenshots or Files
              </span>
              <div className="mt-2 rounded-md border border-dashed border-muted-whites/15 bg-black/25 px-3 py-3">
                <input
                  type="file"
                  multiple
                  className="block w-full text-sm text-muted-whites/70 file:mr-4 file:rounded-md file:border-0 file:bg-muted-whites file:px-4 file:py-2 file:text-sm file:font-bold file:text-primary"
                />
              </div>
              <p className="mt-2 text-xs text-muted-whites/45">
                Optional. File upload is staged visually in this preview and will
                be wired to storage with the helper agent.
              </p>
            </label>

            <label className="flex gap-3 rounded-md border border-white/10 bg-black/25 p-4 text-sm text-muted-whites/75">
              <input
                type="checkbox"
                checked={form.acknowledged}
                onChange={(event) =>
                  updateForm('acknowledged', event.target.checked)
                }
                className="mt-1 h-4 w-4 accent-accent-gold"
              />
              <span>
                I understand this creates a support request only. Website changes
                require review and approval before publishing.
              </span>
            </label>

            <button
              type="button"
              onClick={submitTicket}
              className="w-full rounded-md bg-accent-gold px-5 py-4 text-sm font-black uppercase tracking-wide text-primary transition hover:bg-accent-gold/90"
            >
              Send to Website Helper
            </button>
          </div>
        </section>

        <section className="rounded-lg border border-white/10 bg-black/35">
          <div className="border-b border-white/10 px-5 py-5">
            <h2 className="text-sm font-black uppercase tracking-wide">
              Recent Support Tickets
            </h2>
            <p className="mt-2 text-sm text-muted-whites/55">
              Latest requests captured from this dashboard.
            </p>
          </div>

          <div className="max-h-[760px] space-y-4 overflow-auto p-5">
            {tickets.map((ticket) => (
              <article
                key={ticket.id}
                className="rounded-lg border border-white/10 bg-black/25 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wide">
                      {ticket.title}
                    </h3>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-muted-whites/45">
                      {ticket.type} / {ticket.priority}
                    </p>
                  </div>
                  <span
                    className={`rounded-md px-3 py-1 text-xs font-black uppercase ${
                      ticket.status === 'Sent'
                        ? 'bg-cyan-400/15 text-cyan-100'
                        : ticket.status === 'Retry Needed'
                          ? 'bg-red-500/15 text-red-200'
                          : 'bg-accent-gold/15 text-accent-gold'
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>
                <p className="mt-4 text-sm text-muted-whites/65">
                  {ticket.summary}
                </p>
                <p className="mt-4 text-xs text-muted-whites/40">
                  {ticket.section} / {ticket.createdAt}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-5 rounded-lg border border-white/10 bg-black/35">
        <div className="border-b border-white/10 px-5 py-4">
          <h2 className="text-sm font-black uppercase tracking-wide">
            Current Handoff Payload
          </h2>
        </div>
        <pre className="max-h-72 overflow-auto p-5 text-xs leading-relaxed text-muted-whites/65">
          {payload}
        </pre>
      </section>
    </>
  );
}
