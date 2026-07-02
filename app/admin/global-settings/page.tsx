import { contactInfo } from '../../../lib/siteContent';

const settings = [
  ['Firm Name', contactInfo.firmName],
  ['Email', contactInfo.email],
  ['Phone', contactInfo.phoneDisplay],
  ['Office Hours', contactInfo.weekdayHours],
];

export default function Page() {
  return (
    <>
      <header className="rounded-lg border border-white/10 bg-black/40 p-5">
        <p className="text-xs font-black uppercase tracking-[0.26em] text-accent-gold">
          Settings
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">
          Global Settings
        </h1>
        <p className="mt-2 text-sm text-muted-whites/60">
          Shared firm details used across the public website.
        </p>
      </header>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {settings.map(([label, value]) => (
          <div key={label} className="rounded-lg border border-white/10 bg-black/35 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-whites/45">
              {label}
            </p>
            <p className="mt-3 text-sm font-bold text-muted-whites">{value}</p>
          </div>
        ))}
      </div>
    </>
  );
}
