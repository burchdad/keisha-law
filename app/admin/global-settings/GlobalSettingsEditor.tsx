'use client';

import { useMemo, useState } from 'react';
import { contactInfo } from '../../../lib/siteContent';

type SettingsDraft = {
  firmName: string;
  email: string;
  phoneDisplay: string;
  fax: string;
  addressLine1: string;
  addressLine2: string;
  weekdayHours: string;
  saturdayHours: string;
  sundayHours: string;
  notaryNote: string;
};

const initialDraft: SettingsDraft = {
  firmName: contactInfo.firmName,
  email: contactInfo.email,
  phoneDisplay: contactInfo.phoneDisplay,
  fax: contactInfo.fax,
  addressLine1: contactInfo.addressLine1,
  addressLine2: contactInfo.addressLine2,
  weekdayHours: contactInfo.weekdayHours,
  saturdayHours: contactInfo.saturdayHours,
  sundayHours: contactInfo.sundayHours,
  notaryNote: contactInfo.notaryNote,
};

function SettingField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block rounded-lg border border-white/10 bg-black/35 p-5">
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted-whites/45">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 h-11 w-full rounded-md border border-white/10 bg-black/30 px-3 text-sm font-bold text-muted-whites outline-none transition focus:border-accent-gold"
      />
    </label>
  );
}

function SettingTextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block rounded-lg border border-white/10 bg-black/35 p-5 md:col-span-2">
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted-whites/45">
        {label}
      </span>
      <textarea
        value={value}
        rows={3}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 w-full resize-y rounded-md border border-white/10 bg-black/30 px-3 py-3 text-sm font-bold leading-relaxed text-muted-whites outline-none transition focus:border-accent-gold"
      />
    </label>
  );
}

export default function GlobalSettingsEditor() {
  const [draft, setDraft] = useState(initialDraft);
  const [status, setStatus] = useState('');
  const payload = useMemo(() => JSON.stringify(draft, null, 2), [draft]);

  const updateDraft = <Key extends keyof SettingsDraft>(
    key: Key,
    value: SettingsDraft[Key]
  ) => {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const saveDraft = () => {
    window.localStorage.setItem('rachal-law-global-settings-draft', payload);
    setStatus('Global settings draft saved in this dashboard. No support ticket was created.');
  };

  return (
    <>
      <header className="rounded-lg border border-white/10 bg-black/40 p-5">
        <p className="text-xs font-black uppercase tracking-[0.26em] text-accent-gold">
          Settings
        </p>
        <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight">
              Global Settings
            </h1>
            <p className="mt-2 text-sm text-muted-whites/60">
              Edit shared firm details used across the public website.
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
              Save Settings
            </button>
          </div>
        </div>
      </header>

      {status && (
        <div className="mt-5 rounded-md border border-accent-gold/30 bg-accent-gold/10 px-4 py-3 text-sm font-semibold text-accent-gold">
          {status}
        </div>
      )}

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <SettingField
          label="Firm Name"
          value={draft.firmName}
          onChange={(value) => updateDraft('firmName', value)}
        />
        <SettingField
          label="Email"
          value={draft.email}
          onChange={(value) => updateDraft('email', value)}
        />
        <SettingField
          label="Phone"
          value={draft.phoneDisplay}
          onChange={(value) => updateDraft('phoneDisplay', value)}
        />
        <SettingField
          label="Fax"
          value={draft.fax}
          onChange={(value) => updateDraft('fax', value)}
        />
        <SettingField
          label="Address Line 1"
          value={draft.addressLine1}
          onChange={(value) => updateDraft('addressLine1', value)}
        />
        <SettingField
          label="Address Line 2"
          value={draft.addressLine2}
          onChange={(value) => updateDraft('addressLine2', value)}
        />
        <SettingField
          label="Weekday Hours"
          value={draft.weekdayHours}
          onChange={(value) => updateDraft('weekdayHours', value)}
        />
        <SettingField
          label="Saturday Hours"
          value={draft.saturdayHours}
          onChange={(value) => updateDraft('saturdayHours', value)}
        />
        <SettingField
          label="Sunday Hours"
          value={draft.sundayHours}
          onChange={(value) => updateDraft('sundayHours', value)}
        />
        <SettingTextArea
          label="Notary Note"
          value={draft.notaryNote}
          onChange={(value) => updateDraft('notaryNote', value)}
        />
      </div>

      <section className="mt-5 rounded-lg border border-white/10 bg-black/35">
        <div className="border-b border-white/10 px-5 py-4">
          <h2 className="text-sm font-black uppercase tracking-wide">
            Saved Settings Payload
          </h2>
        </div>
        <pre className="max-h-72 overflow-auto p-5 text-xs leading-relaxed text-muted-whites/65">
          {payload}
        </pre>
      </section>
    </>
  );
}
