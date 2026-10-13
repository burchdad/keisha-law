import 'server-only';
import { handleContact } from '../../../lib/contact-server';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: Request) {
  return handleContact(request);
}
