import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload) {
    return NextResponse.json(
      { message: 'Invalid support payload.' },
      { status: 400 }
    );
  }

  const endpoint = process.env.GHOST_MISSION_CONTROL_WEBHOOK_URL;

  if (!endpoint) {
    return NextResponse.json(
      {
        forwarded: false,
        message:
          'Website helper request received. Configure GHOST_MISSION_CONTROL_WEBHOOK_URL to forward requests.',
      },
      { status: 202 }
    );
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source: 'rachal-law-web-helper',
      type: 'website-support-request',
      payload,
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { message: 'Ghost Mission Control did not accept the support request.' },
      { status: 502 }
    );
  }

  return NextResponse.json({
    forwarded: true,
    message: 'Website helper request sent to Ghost Mission Control.',
  });
}
