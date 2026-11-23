import type { ApiFetcher } from './fetch-utils';
import { paths } from './schema';
import { OpForPath, OpRequestBody, OpResponseBody } from './utils';

// Two-factor authentication (TOTP) of the signed-in user and the organization
// setting that requires it. The sign-in steps live in ./authentication.
export const TWO_FACTOR_ROUTES = {
  STATUS: '/api/auth/two-factor',
  SETUP: '/api/auth/two-factor/setup',
  SETUP_CONFIRM: '/api/auth/two-factor/setup/confirm',
  RECOVERY_CODES: '/api/auth/two-factor/recovery-codes',
  DISABLE: '/api/auth/two-factor/disable',
  ORGANIZATION: '/api/organization/two-factor',
} as const satisfies Record<string, keyof paths>;

export type TwoFactorStatus = OpResponseBody<
  OpForPath<typeof TWO_FACTOR_ROUTES.STATUS, 'get'>
>;
export type TwoFactorSetupResponse = OpResponseBody<
  OpForPath<typeof TWO_FACTOR_ROUTES.SETUP, 'post'>
>;
export type TwoFactorConfirmSetupBody = OpRequestBody<
  OpForPath<typeof TWO_FACTOR_ROUTES.SETUP_CONFIRM, 'post'>
>;
export type TwoFactorRecoveryCodesResponse = OpResponseBody<
  OpForPath<typeof TWO_FACTOR_ROUTES.SETUP_CONFIRM, 'post'>
>;
export type TwoFactorVerifyBody = OpRequestBody<
  OpForPath<typeof TWO_FACTOR_ROUTES.DISABLE, 'post'>
>;
export type OrganizationTwoFactor = OpResponseBody<
  OpForPath<typeof TWO_FACTOR_ROUTES.ORGANIZATION, 'get'>
>;
export type OrganizationTwoFactorBody = OpRequestBody<
  OpForPath<typeof TWO_FACTOR_ROUTES.ORGANIZATION, 'put'>
>;

export async function fetchTwoFactorStatus(
  fetcher: ApiFetcher
): Promise<TwoFactorStatus> {
  const get = fetcher.path(TWO_FACTOR_ROUTES.STATUS).method('get').create();
  const { data } = await get({});
  return data as TwoFactorStatus;
}

export async function startTwoFactorSetup(
  fetcher: ApiFetcher
): Promise<TwoFactorSetupResponse> {
  const post = fetcher.path(TWO_FACTOR_ROUTES.SETUP).method('post').create();
  const { data } = await post({} as never);
  return data as TwoFactorSetupResponse;
}

export async function confirmTwoFactorSetup(
  fetcher: ApiFetcher,
  body: TwoFactorConfirmSetupBody
): Promise<TwoFactorRecoveryCodesResponse> {
  const post = fetcher
    .path(TWO_FACTOR_ROUTES.SETUP_CONFIRM)
    .method('post')
    .create();
  const { data } = await post(body as never);
  return data as TwoFactorRecoveryCodesResponse;
}

export async function regenerateTwoFactorRecoveryCodes(
  fetcher: ApiFetcher,
  body: TwoFactorVerifyBody
): Promise<TwoFactorRecoveryCodesResponse> {
  const post = fetcher
    .path(TWO_FACTOR_ROUTES.RECOVERY_CODES)
    .method('post')
    .create();
  const { data } = await post(body as never);
  return data as TwoFactorRecoveryCodesResponse;
}

export async function disableTwoFactor(
  fetcher: ApiFetcher,
  body: TwoFactorVerifyBody
): Promise<void> {
  const post = fetcher.path(TWO_FACTOR_ROUTES.DISABLE).method('post').create();
  await post(body as never);
}

export async function fetchOrganizationTwoFactor(
  fetcher: ApiFetcher
): Promise<OrganizationTwoFactor> {
  const get = fetcher
    .path(TWO_FACTOR_ROUTES.ORGANIZATION)
    .method('get')
    .create();
  const { data } = await get({});
  return data as OrganizationTwoFactor;
}

export async function updateOrganizationTwoFactor(
  fetcher: ApiFetcher,
  body: OrganizationTwoFactorBody
): Promise<OrganizationTwoFactor> {
  const put = fetcher
    .path(TWO_FACTOR_ROUTES.ORGANIZATION)
    .method('put')
    .create();
  const { data } = await put(body as never);
  return data as OrganizationTwoFactor;
}
