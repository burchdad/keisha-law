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
  mergeEditableContent,
  type EditableSiteContent,
} from './editableContentMerge';
import {
  contactInfo as defaultContactInfo,
  siteCopy as defaultSiteCopy,
} from './siteContent';
import type { ContentDraft, SettingsDraft, SiteOverrides } from './editableContentTypes';

export const contentDraftStorageKey = 'rachal-law-content-draft';
export const settingsDraftStorageKey = 'rachal-law-global-settings-draft';
export const editableContentEvent = 'rachal-law-editable-content-updated';
export const publishedOverridesPath = '/site-overrides.json';

const defaultContent: EditableSiteContent = {
  siteCopy: defaultSiteCopy,
  contactInfo: defaultContactInfo,
};

const EditableSiteContentContext =
  createContext<EditableSiteContent>(defaultContent);

const readStoredJson = <Value,>(key: string): Value | null => {
  const storedValue = window.localStorage.getItem(key);

  if (!storedValue) {
    return null;
  }

  try {
    return JSON.parse(storedValue) as Value;
  } catch {
    window.localStorage.removeItem(key);
    return null;
  }
};

const getLocalDrafts = () => ({
  contentDraft: readStoredJson<ContentDraft>(contentDraftStorageKey) ?? {},
  settingsDraft: readStoredJson<SettingsDraft>(settingsDraftStorageKey) ?? {},
});

const fetchPublishedOverrides = async (): Promise<SiteOverrides | null> => {
  try {
    const response = await fetch(`${publishedOverridesPath}?t=${Date.now()}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as SiteOverrides;
  } catch {
    return null;
  }
};

export function notifyEditableContentUpdated() {
  window.dispatchEvent(new Event(editableContentEvent));
}

export function EditableSiteContentProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [content, setContent] = useState<EditableSiteContent>(defaultContent);

  useEffect(() => {
    const refreshContent = async () => {
      const publishedOverrides = await fetchPublishedOverrides();
      const localDrafts = getLocalDrafts();

      setContent(
        mergeEditableContent({
          contentDraft: {
            ...(publishedOverrides?.contentDraft ?? {}),
            ...localDrafts.contentDraft,
          },
          settingsDraft: {
            ...(publishedOverrides?.settingsDraft ?? {}),
            ...localDrafts.settingsDraft,
          },
        })
      );
    };

    void refreshContent();

    const refreshFromEvent = () => {
      void refreshContent();
    };

    window.addEventListener('storage', refreshFromEvent);
    window.addEventListener(editableContentEvent, refreshFromEvent);

    return () => {
      window.removeEventListener('storage', refreshFromEvent);
      window.removeEventListener(editableContentEvent, refreshFromEvent);
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
