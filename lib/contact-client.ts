// Pure browser-safe request construction; contains no secrets or email routing.
export type ContactFormData = {
  name: string; email: string; phone: string; practiceArea: string; message: string; website: string;
};

export function createContactRequest(form: ContactFormData, submissionId: string, useResend = false) {
  if (useResend) return { url: '/api/contact', payload: { ...form, submissionId } };
  // Preserve the original Formspree contract until the authorized cutover.
  return {
    url: 'https://formspree.io/f/xykqaaln',
    payload: {
      name: form.name, email: form.email, phone: form.phone,
      practiceArea: form.practiceArea, message: form.message,
      _subject: 'New Rachal Law Firm APC Website Inquiry',
    },
  };
}

export function contactWasAccepted(httpOk: boolean, result: unknown, useResend = false) {
  return httpOk && (!useResend ||
    (result !== null && typeof result === 'object' && 'ok' in result && result.ok === true));
}
