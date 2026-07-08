import {
  contactInfo as defaultContactInfo,
  siteCopy as defaultSiteCopy,
} from './siteContent';
import type {
  ContactInfo,
  ContentDraft,
  SettingsDraft,
  SiteCopy,
} from './editableContentTypes';

export type { ContactInfo, ContentDraft, SettingsDraft, SiteCopy };

export type EditableSiteContent = {
  siteCopy: SiteCopy;
  contactInfo: ContactInfo;
};

const phoneHrefFromDisplay = (phoneDisplay: string) => {
  const digits = phoneDisplay.replace(/\D/g, '');
  return digits ? `tel:${digits}` : defaultContactInfo.phoneHref;
};

const emailHrefFromEmail = (email: string) =>
  email ? `mailto:${email}` : defaultContactInfo.emailHref;

export const mergeEditableContent = ({
  contentDraft = {},
  settingsDraft = {},
}: {
  contentDraft?: ContentDraft;
  settingsDraft?: SettingsDraft;
}): EditableSiteContent => {
  const email = settingsDraft.email ?? defaultContactInfo.email;
  const phoneDisplay =
    settingsDraft.phoneDisplay ?? defaultContactInfo.phoneDisplay;

  return {
    siteCopy: {
      ...defaultSiteCopy,
      hero: {
        ...defaultSiteCopy.hero,
        headlineLine1:
          contentDraft.heroHeadlineLine1 ??
          defaultSiteCopy.hero.headlineLine1,
        headlineLine2:
          contentDraft.heroHeadlineLine2 ??
          defaultSiteCopy.hero.headlineLine2,
        body: contentDraft.heroBody ?? defaultSiteCopy.hero.body,
      },
      servicesIntro: {
        ...defaultSiteCopy.servicesIntro,
        heading:
          contentDraft.servicesHeading ??
          defaultSiteCopy.servicesIntro.heading,
        body: contentDraft.servicesBody ?? defaultSiteCopy.servicesIntro.body,
      },
      trustCard: {
        ...defaultSiteCopy.trustCard,
        quote:
          contentDraft.trustCardQuote ?? defaultSiteCopy.trustCard.quote,
      },
      homeAbout: {
        ...defaultSiteCopy.homeAbout,
        heading:
          contentDraft.meetHeading ?? defaultSiteCopy.homeAbout.heading,
        paragraphs: [
          contentDraft.meetParagraph1 ??
            defaultSiteCopy.homeAbout.paragraphs[0],
          contentDraft.meetParagraph2 ??
            defaultSiteCopy.homeAbout.paragraphs[1],
        ],
      },
      aboutPage: {
        ...defaultSiteCopy.aboutPage,
        heroBody:
          contentDraft.aboutHeroBody ?? defaultSiteCopy.aboutPage.heroBody,
        storyParagraphs: [
          contentDraft.aboutStoryParagraph1 ??
            defaultSiteCopy.aboutPage.storyParagraphs[0],
          contentDraft.aboutStoryParagraph2 ??
            defaultSiteCopy.aboutPage.storyParagraphs[1],
        ],
      },
      contactPage: {
        ...defaultSiteCopy.contactPage,
        heroBody:
          contentDraft.contactHeroBody ??
          defaultSiteCopy.contactPage.heroBody,
      },
      footer: {
        ...defaultSiteCopy.footer,
        description:
          contentDraft.footerDescription ??
          defaultSiteCopy.footer.description,
      },
    },
    contactInfo: {
      ...defaultContactInfo,
      ...settingsDraft,
      email,
      emailHref: emailHrefFromEmail(email),
      phoneDisplay,
      phoneHref: phoneHrefFromDisplay(phoneDisplay),
    },
  };
};
