import type { ApiFetcher } from './fetch-utils';
import { paths } from './schema';
import { OpForPath, OpRequestBody, OpResponseBody } from './utils';

export const SIMPLEFIN_ROUTES = {
  CLAIM_TOKEN: '/api/banking/simplefin/claim-token',
  LINK_ACCOUNTS: '/api/banking/simplefin/link-accounts',
  ITEM_BY_ID: '/api/banking/simplefin/items/{itemId}',
} as const satisfies Record<string, keyof paths>;

export type SimpleFinClaimTokenBody = OpRequestBody<
  OpForPath<typeof SIMPLEFIN_ROUTES.CLAIM_TOKEN, 'post'>
>;
export type SimpleFinClaimTokenResponse = OpResponseBody<
  OpForPath<typeof SIMPLEFIN_ROUTES.CLAIM_TOKEN, 'post'>
>;
export type SimpleFinClaimedAccount = SimpleFinClaimTokenResponse['accounts'][number];

export type SimpleFinLinkAccountsBody = OpRequestBody<
  OpForPath<typeof SIMPLEFIN_ROUTES.LINK_ACCOUNTS, 'post'>
>;
export type SimpleFinLinkAccountsResponse = OpResponseBody<
  OpForPath<typeof SIMPLEFIN_ROUTES.LINK_ACCOUNTS, 'post'>
>;

/**
 * Claims a SimpleFIN setup token and returns the accounts available to link.
 */
export async function claimSimpleFinToken(
  fetcher: ApiFetcher,
  body: SimpleFinClaimTokenBody
): Promise<SimpleFinClaimTokenResponse> {
  const post = fetcher.path(SIMPLEFIN_ROUTES.CLAIM_TOKEN).method('post').create();
  const { data } = await post(body);
  return data as SimpleFinClaimTokenResponse;
}

/**
 * Links the selected SimpleFIN accounts as bank/credit card accounts.
 */
export async function linkSimpleFinAccounts(
  fetcher: ApiFetcher,
  body: SimpleFinLinkAccountsBody
): Promise<SimpleFinLinkAccountsResponse> {
  const post = fetcher.path(SIMPLEFIN_ROUTES.LINK_ACCOUNTS).method('post').create();
  const { data } = await post(body);
  return data as SimpleFinLinkAccountsResponse;
}

/**
 * Removes a claimed SimpleFIN connection that has no linked accounts yet.
 */
export async function deleteSimpleFinItem(
  fetcher: ApiFetcher,
  itemId: string
): Promise<void> {
  const del = fetcher.path(SIMPLEFIN_ROUTES.ITEM_BY_ID).method('delete').create();
  await del({ itemId });
}
