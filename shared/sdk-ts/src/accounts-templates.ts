import type { ApiFetcher } from './fetch-utils';
import { paths, components } from './schema';
import { OpForPath, OpResponseBody } from './utils';

export const ACCOUNTS_TEMPLATES_ROUTES = {
  LIST: '/api/accounts-templates',
  PREVIEW: '/api/accounts-templates/{templateKey}/preview',
  APPLY: '/api/accounts-templates/{templateKey}/apply',
} as const satisfies Record<string, keyof paths>;

export type AccountsTemplatesList = OpResponseBody<OpForPath<typeof ACCOUNTS_TEMPLATES_ROUTES.LIST, 'get'>>;
export type AccountsTemplate = components['schemas']['AccountsTemplateDto'];
export type AccountsTemplatePlan = components['schemas']['AccountsTemplatePlanDto'];
export type AccountsTemplateChange = components['schemas']['AccountsTemplateChangeDto'];
export type AccountsTemplateIssue = components['schemas']['AccountsTemplateIssueDto'];

export interface AccountsTemplateSelection {
  templateKey: string;
  variant?: string;
}

export async function fetchAccountsTemplates(
  fetcher: ApiFetcher
): Promise<AccountsTemplate[]> {
  const get = fetcher.path(ACCOUNTS_TEMPLATES_ROUTES.LIST).method('get').create();
  const { data } = await get({});
  return data as AccountsTemplate[];
}

export async function previewAccountsTemplate(
  fetcher: ApiFetcher,
  { templateKey, variant }: AccountsTemplateSelection
): Promise<AccountsTemplatePlan> {
  const get = fetcher.path(ACCOUNTS_TEMPLATES_ROUTES.PREVIEW).method('get').create();
  const { data } = await get({ templateKey, variant });
  return data;
}

export async function applyAccountsTemplate(
  fetcher: ApiFetcher,
  { templateKey, variant }: AccountsTemplateSelection
): Promise<AccountsTemplatePlan> {
  const post = fetcher.path(ACCOUNTS_TEMPLATES_ROUTES.APPLY).method('post').create();
  const { data } = await post({ templateKey, variant });
  return data;
}
