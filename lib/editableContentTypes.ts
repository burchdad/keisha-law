import type {
  contactInfo as defaultContactInfo,
  siteCopy as defaultSiteCopy,
} from './siteContent';

export type SiteCopy = typeof defaultSiteCopy;
export type ContactInfo = typeof defaultContactInfo;

export type ContentDraft = {
  heroHeadlineLine1?: string;
  heroHeadlineLine2?: string;
  heroBody?: string;
  trustCardQuote?: string;
  servicesHeading?: string;
  servicesBody?: string;
  meetHeading?: string;
  meetParagraph1?: string;
  meetParagraph2?: string;
  aboutHeroBody?: string;
  aboutStoryParagraph1?: string;
  aboutStoryParagraph2?: string;
  contactHeroBody?: string;
  footerDescription?: string;
};

export type SettingsDraft = Partial<
  Pick<
    ContactInfo,
    | 'firmName'
    | 'email'
    | 'phoneDisplay'
    | 'fax'
    | 'addressLine1'
    | 'addressLine2'
    | 'weekdayHours'
    | 'saturdayHours'
    | 'sundayHours'
    | 'notaryNote'
  >
>;

export type SiteOverrides = {
  updatedAt: string | null;
  contentDraft: ContentDraft;
  settingsDraft: SettingsDraft;
};
