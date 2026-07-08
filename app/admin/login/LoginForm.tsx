'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const requestedNextPath = searchParams.get('next') || '/admin';
  const nextPath = /^\/admin(\/|$)/.test(requestedNextPath)
    ? requestedNextPath
    : '/admin';

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const result = await response.json().catch(() => null);
      setError(result?.message ?? 'Unable to sign in.');
      setIsSubmitting(false);
      return;
    }

    router.replace(nextPath);
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-black px-4 py-10 text-muted-whites">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center">
        <form
          onSubmit={handleSubmit}
          className="w-full rounded-lg border border-white/10 bg-primary/70 p-6 shadow-2xl"
        >
          <div className="mb-8">
            <p className="text-xs font-black uppercase tracking-[0.26em] text-accent-gold">
              Admin Access
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight">
              Dashboard Login
            </h1>
            <p className="mt-2 text-sm text-muted-whites/60">
              Sign in before opening the Rachal Law admin dashboard.
            </p>
          </div>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted-whites/45">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              className="mt-2 h-12 w-full rounded-md border border-white/10 bg-black/35 px-3 text-sm font-medium text-muted-whites outline-none transition focus:border-accent-gold"
              required
            />
          </label>

          {error && (
            <div className="mt-4 rounded-md border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full rounded-md bg-accent-gold px-5 py-3 text-sm font-black uppercase tracking-wide text-primary transition hover:bg-accent-gold/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Signing In...' : 'Open Dashboard'}
          </button>
        </form>
      </div>
    </main>
  );
}
