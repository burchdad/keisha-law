import { NextResponse } from 'next/server';

const adminSessionCookie = 'rachal_admin_session';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const password = String(body?.password ?? '');
  const configuredPassword = process.env.ADMIN_DASHBOARD_PASSWORD ?? 'admin123';

  if (password !== configuredPassword) {
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
    path: '/admin',
    maxAge: 60 * 60 * 8,
  });

  return response;
}
