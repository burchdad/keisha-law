import { firmLinks } from '../../../lib/siteContent';

export default function Page() {
  return (
    <section className="rounded-lg border border-white/10 bg-black/40 p-5">
      <p className="text-xs font-black uppercase tracking-[0.26em] text-accent-gold">
        Integration
      </p>
      <h1 className="mt-2 text-3xl font-black tracking-tight">Payment Link</h1>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-whites/65">
        Current payment destination is LawPay. This page can later track payment
        link audits and support requests.
      </p>
      <a
        href={firmLinks.payment}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex rounded-md bg-accent-gold px-4 py-2 text-sm font-bold text-primary"
      >
        Open Payment Link
      </a>
    </section>
  );
}
