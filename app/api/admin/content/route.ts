import { NextResponse } from 'next/server';
import { contactInfo, siteCopy } from '../../../../lib/siteContent';

export async function GET() {
  return NextResponse.json({
    siteCopy,
    contactInfo,
  });
}

export async function PATCH(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload) {
    return NextResponse.json(
      { message: 'Invalid content payload.' },
      { status: 400 }
    );
  }

  const endpoint = process.env.GHOST_MISSION_CONTROL_WEBHOOK_URL;

  if (!endpoint) {
    return NextResponse.json(
      {
        forwarded: false,
        message:
          'Draft captured. Add GHOST_MISSION_CONTROL_WEBHOOK_URL to forward edits into Ghost Mission Control.',
      },
      { status: 202 }
    );
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source: 'rachal-law-admin-dashboard',
      type: 'website-content-update',
      payload,
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { message: 'Ghost Mission Control did not accept the update request.' },
      { status: 502 }
    );
  }

  return NextResponse.json({
    forwarded: true,
    message: 'Update request sent to Ghost Mission Control.',
  });
}
