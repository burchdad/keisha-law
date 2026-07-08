import { NextResponse } from 'next/server';
import { contactInfo, siteCopy } from '../../../../lib/siteContent';

const stripWrappingQuotes = (value: string) =>
  value.trim().replace(/^["']|["']$/g, '');

const envValue = (key: string, fallback = '') =>
  stripWrappingQuotes(process.env[key] ?? fallback);

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

  const endpoint = envValue('GHOST_MISSION_CONTROL_WEBHOOK_URL');
  const webhookSecret = envValue('GHOST_MISSION_CONTROL_WEBHOOK_SECRET');

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

  if (!webhookSecret) {
    return NextResponse.json(
      {
        forwarded: false,
        message:
          'Draft captured, but GHOST_MISSION_CONTROL_WEBHOOK_SECRET is not configured.',
      },
      { status: 500 }
    );
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Ghost-Webhook-Secret': webhookSecret,
    },
    body: JSON.stringify({
      client: envValue('GHOST_CLIENT_NAME', 'Rachal Law Firm APC'),
      client_id: envValue('GHOST_CLIENT_ID', 'rachal-law-firm-apc'),
      site: envValue('GHOST_SITE_URL', 'https://www.krachallaw.com'),
      repo: envValue('GHOST_REPO', 'burchdad/keisha-law'),
      source: 'client_admin_dashboard',
      request_type: 'content_update',
      page_url: '/admin/content-updates',
      summary: 'Dashboard content update',
      details: 'Content update submitted from the Rachal Law admin dashboard.',
      priority: 'normal',
      attachments: [],
      branch_policy: envValue(
        'GHOST_WEB_HELPER_BRANCH_POLICY',
        'testing_branch_only'
      ),
      approval_required:
        envValue('GHOST_WEB_HELPER_APPROVAL_REQUIRED', 'true') !== 'false',
      web_helper_id: envValue(
        'GHOST_WEB_HELPER_ID',
        'rachal-law-firm-apc-web-helper'
      ),
      raw_request: payload,
    }),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);

    return NextResponse.json(
      {
        forwarded: false,
        message:
          result?.error ??
          result?.message ??
          'Ghost Mission Control did not accept the update request.',
      },
      { status: response.status }
    );
  }

  const result = await response.json().catch(() => null);

  return NextResponse.json({
    forwarded: true,
    message: 'Update request sent to Ghost Mission Control.',
    ticketId:
      result?.ticketId ?? result?.id ?? result?.request?.id ?? result?.ticket?.id,
  });
}
