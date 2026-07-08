import { NextResponse } from 'next/server';
import type { ContentDraft, SettingsDraft, SiteOverrides } from '../../../../lib/editableContentTypes';

export const runtime = 'nodejs';

const adminSessionCookie = 'rachal_admin_session';
const contentPath = 'public/site-overrides.json';

type GithubContentResponse = {
  content?: string;
  sha?: string;
};

const stripWrappingQuotes = (value: string) =>
  value.trim().replace(/^["']|["']$/g, '');

const envValue = (key: string, fallback = '') =>
  stripWrappingQuotes(process.env[key] ?? fallback);

const getGithubToken = () =>
  envValue('GITHUB_CONTENT_TOKEN') || envValue('GITHUB_TOKEN');

const getGithubConfig = () => ({
  token: getGithubToken(),
  repo: envValue('GITHUB_CONTENT_REPO', 'burchdad/keisha-law'),
  branch: envValue('GITHUB_CONTENT_BRANCH', 'main'),
});

const jsonResponse = (message: string, status: number) =>
  NextResponse.json({ message }, { status });

const parsePublishedOverrides = (encodedContent?: string): SiteOverrides => {
  if (!encodedContent) {
    return {
      updatedAt: null,
      contentDraft: {},
      settingsDraft: {},
    };
  }

  try {
    return JSON.parse(
      Buffer.from(encodedContent, 'base64').toString('utf8')
    ) as SiteOverrides;
  } catch {
    return {
      updatedAt: null,
      contentDraft: {},
      settingsDraft: {},
    };
  }
};

export async function PATCH(request: Request) {
  const cookie = request.headers.get('cookie') ?? '';

  if (!cookie.includes(`${adminSessionCookie}=active`)) {
    return jsonResponse('Admin session required.', 401);
  }

  const body = (await request.json().catch(() => null)) as
    | {
        contentDraft?: ContentDraft;
        settingsDraft?: SettingsDraft;
      }
    | null;

  if (!body || (!body.contentDraft && !body.settingsDraft)) {
    return jsonResponse('No content changes were provided.', 400);
  }

  const { token, repo, branch } = getGithubConfig();

  if (!token) {
    return jsonResponse(
      'GitHub publishing is not configured. Add GITHUB_CONTENT_TOKEN in Vercel.',
      503
    );
  }

  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  const contentsUrl = `https://api.github.com/repos/${repo}/contents/${contentPath}`;
  const currentResponse = await fetch(`${contentsUrl}?ref=${branch}`, {
    headers,
  });

  if (!currentResponse.ok) {
    return jsonResponse(
      'Unable to read the current published site content from GitHub.',
      currentResponse.status
    );
  }

  const currentFile = (await currentResponse.json()) as GithubContentResponse;
  const currentOverrides = parsePublishedOverrides(currentFile.content);
  const nextOverrides: SiteOverrides = {
    updatedAt: new Date().toISOString(),
    contentDraft: {
      ...(currentOverrides.contentDraft ?? {}),
      ...(body.contentDraft ?? {}),
    },
    settingsDraft: {
      ...(currentOverrides.settingsDraft ?? {}),
      ...(body.settingsDraft ?? {}),
    },
  };
  const encodedContent = Buffer.from(
    `${JSON.stringify(nextOverrides, null, 2)}\n`,
    'utf8'
  ).toString('base64');
  const publishResponse = await fetch(contentsUrl, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      branch,
      content: encodedContent,
      message: 'Publish dashboard site content updates',
      sha: currentFile.sha,
    }),
  });

  if (!publishResponse.ok) {
    const result = await publishResponse.json().catch(() => null);

    return NextResponse.json(
      {
        message:
          result?.message ??
          'GitHub did not accept the published content update.',
      },
      { status: publishResponse.status }
    );
  }

  const result = await publishResponse.json().catch(() => null);

  return NextResponse.json({
    ok: true,
    message:
      'Published content update. Vercel will redeploy the public site shortly.',
    commitSha: result?.commit?.sha,
    updatedAt: nextOverrides.updatedAt,
  });
}
