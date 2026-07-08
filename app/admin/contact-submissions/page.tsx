const submissions = [
  ['New consultation request', 'Pending review', 'Contact form routing placeholder'],
  ['Notary appointment question', 'Pending review', 'Will connect to form submissions'],
  ['Estate planning inquiry', 'Archived sample', 'Demo data for preview'],
];

export default function Page() {
  return (
    <>
      <header className="rounded-lg border border-white/10 bg-black/40 p-5">
        <p className="text-xs font-black uppercase tracking-[0.26em] text-accent-gold">
          Inbox
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">
          Contact Submissions
        </h1>
        <p className="mt-2 text-sm text-muted-whites/60">
          A future inbox for website form submissions and follow-up notes.
        </p>
      </header>

      <div className="mt-5 space-y-4">
        {submissions.map(([title, status, note]) => (
          <article key={title} className="rounded-lg border border-white/10 bg-black/35 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-black uppercase tracking-wide">{title}</h2>
                <p className="mt-2 text-sm text-muted-whites/55">{note}</p>
              </div>
              <span className="rounded-md bg-accent-gold/15 px-3 py-1 text-xs font-black uppercase text-accent-gold">
                {status}
              </span>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
