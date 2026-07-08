import { NextResponse } from 'next/server';

const adminSessionCookie = 'rachal_admin_session';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const password = String(body?.password ?? '');
  const configuredPassword = process.env.ADMIN_DASHBOARD_PASSWORD?.trim();
  const fallbackPassword =
    process.env.NODE_ENV === 'production' ? '' : 'admin123';
  const adminPassword = configuredPassword || fallbackPassword;

  if (!adminPassword) {
    return NextResponse.json(
      { message: 'Admin password is not configured.' },
      { status: 503 }
    );
  }

  if (password !== adminPassword) {
    return NextResponse.json(
      { message: 'Invalid admin password.' },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminSessionCookie, 'active', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8,
  });

  return response;
}
