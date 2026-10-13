// This module is safe to import from the browser. Never put routing or secrets here.
export const CONTACT_LIMITS = { name: 120, email: 254, phone: 50, message: 5000 } as const;
export const PRACTICE_AREAS = {
  '': 'Not specified',
  conservatorships: 'Conservatorships',
  guardianships: 'Guardianships',
  'estate-planning': 'Estate Planning',
  'probate-matters': 'Probate Matters',
  'name-changes': 'Name Changes',
  'limited-family-law': 'Limited Family Law',
  'notarial-services': 'Notarial Services',
} as const;
export type Inquiry = {
  name: string;
  email: string;
  phone: string;
  practiceArea: keyof typeof PRACTICE_AREAS;
  message: string;
};
