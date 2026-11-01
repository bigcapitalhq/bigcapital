import type { ApiFetcher } from './fetch-utils';
import { paths } from './schema';
import { OpForPath, OpRequestBody, OpResponseBody } from './utils';

export const API_KEYS_ROUTES = {
  LIST: '/api/api-keys',
  GENERATE: '/api/api-keys/generate',
  REVOKE: '/api/api-keys/{id}/revoke',
} as const satisfies Record<string, keyof paths>;

export type ApiKeysList = OpResponseBody<OpForPath<typeof API_KEYS_ROUTES.LIST, 'get'>>;
export type GenerateApiKeyBody = OpRequestBody<OpForPath<typeof API_KEYS_ROUTES.GENERATE, 'post'>>;
export type GenerateApiKeyResponse = OpResponseBody<OpForPath<typeof API_KEYS_ROUTES.GENERATE, 'post'>>;

export async function fetchApiKeys(fetcher: ApiFetcher): Promise<ApiKeysList> {
  const get = fetcher.path(API_KEYS_ROUTES.LIST).method('get').create();
  const { data } = await get({});
  return data;
}

export async function generateApiKey(
  fetcher: ApiFetcher,
  body: GenerateApiKeyBody
): Promise<GenerateApiKeyResponse> {
  const post = fetcher.path(API_KEYS_ROUTES.GENERATE).method('post').create();
  const { data } = await post(body);
  return data;
}

export async function revokeApiKey(fetcher: ApiFetcher, id: number): Promise<void> {
  const put = fetcher.path(API_KEYS_ROUTES.REVOKE).method('put').create();
  await put({ id });
}
