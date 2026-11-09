import type { ApiFetcher } from './fetch-utils';
import { paths } from './schema';
import { OpForPath, OpRequestBody } from './utils';

export const INVITE_ROUTES = {
  INVITE: '/api/invite',
  RESEND: '/api/invite/users/{id}/resend',
  ACCEPT: '/api/invite/accept/{token}',
  CHECK: '/api/invite/check/{token}',
  BULK_INVITE: '/api/invite/bulk',
} as const satisfies Record<string, keyof paths>;

export type InviteUserBody = OpRequestBody<OpForPath<typeof INVITE_ROUTES.INVITE, 'patch'>>;
export type AcceptInviteBody = OpRequestBody<OpForPath<typeof INVITE_ROUTES.ACCEPT, 'post'>>;
export type BulkInviteBody = OpRequestBody<OpForPath<typeof INVITE_ROUTES.BULK_INVITE, 'post'>>;

export async function acceptInvite(
  fetcher: ApiFetcher,
  token: string,
  values: AcceptInviteBody
): Promise<unknown> {
  const post = fetcher.path(INVITE_ROUTES.ACCEPT).method('post').create();
  const { data } = await post({ token, ...values } as never);
  return data;
}

export async function fetchInviteCheck(fetcher: ApiFetcher, token: string): Promise<unknown> {
  const get = fetcher.path(INVITE_ROUTES.CHECK).method('get').create();
  const { data } = await get({ token });
  return data;
}

export async function inviteUser(
  fetcher: ApiFetcher,
  values: InviteUserBody
): Promise<void> {
  const patch = fetcher.path(INVITE_ROUTES.INVITE).method('patch').create();
  await patch(values);
}

export async function resendInvite(fetcher: ApiFetcher, id: number): Promise<void> {
  const post = fetcher.path(INVITE_ROUTES.RESEND).method('post').create();
  await post({ id });
}

export async function bulkSendInviteUsers(
  fetcher: ApiFetcher,
  body: BulkInviteBody
): Promise<unknown> {
  const post = fetcher.path(INVITE_ROUTES.BULK_INVITE).method('post').create();
  const { data } = await post(body as never);
  return data;
}
