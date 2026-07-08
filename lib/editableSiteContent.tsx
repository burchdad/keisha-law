'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  contactInfo as defaultContactInfo,
  siteCopy as defaultSiteCopy,
} from './siteContent';

export const contentDraftStorageKey = 'rachal-law-content-draft';
export const settingsDraftStorageKey = 'rachal-law-global-settings-draft';
export const editableContentEvent = 'rachal-law-editable-content-updated';

type SiteCopy = typeof defaultSiteCopy;
type ContactInfo = typeof defaultContactInfo;

type ContentDraft = {
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

type SettingsDraft = Partial<
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

type EditableSiteContent = {
  siteCopy: SiteCopy;
  contactInfo: ContactInfo;
};

const EditableSiteContentContext = createContext<EditableSiteContent>({
  siteCopy: defaultSiteCopy,
  contactInfo: defaultContactInfo,
});

const readJson = <Value,>(key: string): Value | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedValue = window.localStorage.getItem(key);

  if (!storedValue) {
    return null;
  }

  try {
    return JSON.parse(storedValue) as Value;
  } catch {
    return null;
  }
};

const phoneHrefFromDisplay = (phoneDisplay: string) => {
  const digits = phoneDisplay.replace(/\D/g, '');
  return digits ? `tel:${digits}` : defaultContactInfo.phoneHref;
};

const emailHrefFromEmail = (email: string) =>
  email ? `mailto:${email}` : defaultContactInfo.emailHref;

const getEditableContent = (): EditableSiteContent => {
  const contentDraft = readJson<ContentDraft>(contentDraftStorageKey) ?? {};
  const settingsDraft = readJson<SettingsDraft>(settingsDraftStorageKey) ?? {};
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

export function notifyEditableContentUpdated() {
  window.dispatchEvent(new Event(editableContentEvent));
}

export function EditableSiteContentProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [content, setContent] = useState<EditableSiteContent>({
    siteCopy: defaultSiteCopy,
    contactInfo: defaultContactInfo,
  });

  useEffect(() => {
    const refreshContent = () => setContent(getEditableContent());

    refreshContent();
    window.addEventListener('storage', refreshContent);
    window.addEventListener(editableContentEvent, refreshContent);

    return () => {
      window.removeEventListener('storage', refreshContent);
      window.removeEventListener(editableContentEvent, refreshContent);
    };
  }, []);

  const value = useMemo(() => content, [content]);

  return (
    <EditableSiteContentContext.Provider value={value}>
      {children}
    </EditableSiteContentContext.Provider>
  );
}

export const useEditableSiteContent = () =>
  useContext(EditableSiteContentContext);
