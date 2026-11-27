import type { AuthSigninResponse } from '../authentication';
import type { ApiFetcher } from '../fetch-utils';
import type { OpForPath, OpRequestBody, OpResponseBody } from '../utils';

const settingsPath = '/api/organization/saml';

export type OrganizationSamlSettings = OpResponseBody<
  OpForPath<typeof settingsPath, 'get'>
>;
export type OrganizationSamlSettingsBody = OpRequestBody<
  OpForPath<typeof settingsPath, 'put'>
>;

export async function fetchOrganizationSamlSettings(
  fetcher: ApiFetcher,
): Promise<OrganizationSamlSettings> {
  const get = fetcher.path(settingsPath).method('get').create();
  const { data } = await get({});
  return data;
}

export async function updateOrganizationSamlSettings(
  fetcher: ApiFetcher,
  body: OrganizationSamlSettingsBody,
): Promise<OrganizationSamlSettings> {
  const put = fetcher.path(settingsPath).method('put').create();
  const { data } = await put(body);
  return data;
}

export async function exchangeSamlCode(
  fetcher: ApiFetcher,
  code: string,
): Promise<AuthSigninResponse> {
  const post = fetcher.path('/api/auth/saml/exchange').method('post').create();
  const { data } = await post({ code }, { credentials: 'same-origin' });
  return data;
}

export function samlLoginPath(organizationId: string) {
  return `/api/auth/saml/${encodeURIComponent(organizationId)}/login`;
}
