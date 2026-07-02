import { contactInfo, siteCopy } from '../../../lib/siteContent';

const sections = [
  ['Home Hero', siteCopy.hero.body],
  ['Meet Section', siteCopy.homeAbout.paragraphs[0]],
  ['About Page', siteCopy.aboutPage.storyParagraphs[0]],
  ['Contact Details', `${contactInfo.addressLine1}, ${contactInfo.addressLine2}`],
];

export default function Page() {
  return (
    <>
      <header className="rounded-lg border border-white/10 bg-black/40 p-5">
        <p className="text-xs font-black uppercase tracking-[0.26em] text-accent-gold">
          Content CMS
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">
          Content Updates
        </h1>
        <p className="mt-2 text-sm text-muted-whites/60">
          Review editable website sections before they are routed into the helper workflow.
        </p>
      </header>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {sections.map(([title, body]) => (
          <article key={title} className="rounded-lg border border-white/10 bg-black/35 p-5">
            <h2 className="text-sm font-black uppercase tracking-wide">{title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-whites/65">{body}</p>
            <button className="mt-5 rounded-md border border-accent-gold/40 px-4 py-2 text-sm font-bold text-accent-gold">
              Create Update Ticket
            </button>
          </article>
        ))}
      </div>
    </>
  );
}
