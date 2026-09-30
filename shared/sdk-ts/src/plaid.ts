import type { ApiFetcher } from './fetch-utils';
import { paths } from './schema';

export const PLAID_ROUTES = {
  LINK_TOKEN: '/api/banking/plaid/link-token',
  EXCHANGE_TOKEN: '/api/banking/plaid/exchange-token',
} as const satisfies Record<string, keyof paths>;

export interface PlaidLinkTokenResponse {
  linkToken?: string;
  [key: string]: unknown;
}

export interface PlaidAccountLink {
  plaidAccountId: string;
  accountId: number;
}

export interface PlaidExchangeTokenBody {
  publicToken: string;
  institutionId?: string;
  accounts?: PlaidAccountLink[];
  [key: string]: unknown;
}

export async function fetchPlaidLinkToken(
  fetcher: ApiFetcher
): Promise<PlaidLinkTokenResponse> {
  const post = fetcher
    .path(PLAID_ROUTES.LINK_TOKEN)
    .method('post')
    .create();
  const { data } = await post({});
  return (data ?? {}) as PlaidLinkTokenResponse;
}

export async function fetchPlaidExchangeToken(
  fetcher: ApiFetcher,
  body: PlaidExchangeTokenBody
): Promise<void> {
  const post = fetcher
    .path(PLAID_ROUTES.EXCHANGE_TOKEN)
    .method('post')
    .create();
  await post(body as never);
}
