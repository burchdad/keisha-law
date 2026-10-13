import { writeFileSync } from 'node:fs';
import { renderInquiryEmail } from '../lib/contact-server.ts';
// Static design sample only. No API call, secrets, actual inquiry or case narrative.
const result = renderInquiryEmail({ name: 'Jordan Example', email: 'jordan@example.com',
  phone: '+1 (202) 555-0123' }, 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb');
const preview = result.html.replace('<head>', '<head><meta name="robots" content="noindex,nofollow,noarchive">')
  .replace('<title>New website inquiry</title>', '<title>Synthetic notification design preview</title>')
  .replace('<body style="margin:0;padding:0;background:#f1efeb">',
    '<body style="margin:0;padding:0;background:#f1efeb"><p style="margin:0;padding:14px;text-align:center;font:700 12px/1.6 Arial,sans-serif;color:#435466;background:#fff">SYNTHETIC DESIGN PREVIEW · NOT A REAL INQUIRY</p>');
writeFileSync(new URL('../public/review/contact-email.html', import.meta.url), preview + '\n');
