'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

const navItems = [
  { href: '/admin', label: 'Dashboard Overview' },
  { href: '/admin/content-updates', label: 'Content Updates' },
  { href: '/admin/website-support', label: 'Website Support' },
  { href: '/admin/contact-submissions', label: 'Contact Submissions' },
  { href: '/admin/client-portal', label: 'Client Portal' },
  { href: '/admin/payment-link', label: 'Payment Link' },
  { href: '/admin/global-settings', label: 'Global Settings' },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleSignOut = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-black text-muted-whites">
      <div className="grid min-h-screen lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="border-b border-white/10 bg-black px-5 py-5 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
          <div className="mb-7 rounded-lg border border-white/10 bg-primary/60 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent-gold/15 text-accent-gold">
                RL
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-accent-gold">
                  Admin
                </p>
                <p className="text-xs text-muted-whites/55">Website updates</p>
              </div>
            </div>
          </div>

          <nav className="space-y-1" aria-label="Admin sections">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-md px-3 py-3 text-sm font-bold transition ${
                    isActive
                      ? 'bg-accent-gold text-primary'
                      : 'text-muted-whites/70 hover:bg-white/5 hover:text-muted-whites'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 grid gap-3">
            <Link
              href="/"
              className="rounded-md border border-white/15 px-4 py-3 text-center text-sm font-bold text-muted-whites/80 transition hover:border-accent-gold hover:text-accent-gold"
            >
              View Website
            </Link>
            <Link
              href="/admin/website-support"
              className="rounded-md border border-white/15 px-4 py-3 text-center text-sm font-bold text-muted-whites/80 transition hover:border-accent-gold hover:text-accent-gold"
            >
              New Support Ticket
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-md border border-white/15 px-4 py-3 text-sm font-bold text-muted-whites/80 transition hover:border-accent-gold hover:text-accent-gold"
            >
              Sign Out
            </button>
          </div>
        </aside>

        <section className="min-w-0 px-4 py-5 sm:px-6 lg:px-8">
          {children}
        </section>
      </div>
    </main>
  );
}
