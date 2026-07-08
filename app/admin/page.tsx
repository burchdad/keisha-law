export const metadata = {
  title: 'Website Admin | Rachal Law Firm APC',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return (
    <>
      <header className="rounded-lg border border-white/10 bg-black/40 p-5">
        <p className="text-xs font-black uppercase tracking-[0.26em] text-accent-gold">
          Website Admin
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-muted-whites">
          Dashboard Overview
        </h1>
        <p className="mt-2 text-sm text-muted-whites/60">
          Monitor website support, content requests, and client-facing access points.
        </p>
      </header>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {[
          ['Open Tickets', '3', 'Website support'],
          ['Content Areas', '7', 'Ready for structured editing'],
          ['Integrations', '2', 'Portal and payment links'],
        ].map(([label, value, note]) => (
          <div key={label} className="rounded-lg border border-white/10 bg-black/25 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-whites/45">
              {label}
            </p>
            <p className="mt-3 text-4xl font-black text-muted-whites">{value}</p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-accent-gold">
              {note}
            </p>
          </div>
        ))}
      </div>

      <section className="mt-5 rounded-lg border border-white/10 bg-black/35 p-5">
        <h2 className="text-sm font-black uppercase tracking-wide">
          Recommended Next Step
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-whites/65">
          Use Website Support to create review-gated update tickets for the web
          helper agent. Content Updates can become the direct-edit CMS area once
          storage and approval rules are connected.
        </p>
      </section>
    </>
  );
}
