import type { ApiFetcher } from './fetch-utils';
import { paths } from './schema';
import { OpForPath, OpRequestBody, OpResponseBody } from './utils';

export const SUBSCRIPTION_ROUTES = {
  LIST: '/api/subscription',
  PLANS: '/api/subscription/plans',
  CHECKOUT_SESSION: '/api/subscription/stripe/checkout_session',
  PORTAL_SESSION: '/api/subscription/stripe/portal_session',
  SYNC_CHECKOUT_SESSION: '/api/subscription/stripe/sync',
  CANCEL: '/api/subscription/cancel',
  RESUME: '/api/subscription/resume',
  CHANGE: '/api/subscription/change',
} as const satisfies Record<string, keyof paths>;

export type SubscriptionsListResponse = OpResponseBody<
  OpForPath<typeof SUBSCRIPTION_ROUTES.LIST, 'get'>
>;
export type SubscriptionPlansResponse = OpResponseBody<
  OpForPath<typeof SUBSCRIPTION_ROUTES.PLANS, 'get'>
>;
export type CreateStripeCheckoutSessionBody = OpRequestBody<
  OpForPath<typeof SUBSCRIPTION_ROUTES.CHECKOUT_SESSION, 'post'>
>;
export type CreateSubscriptionCheckoutSessionResponse = OpResponseBody<
  OpForPath<typeof SUBSCRIPTION_ROUTES.CHECKOUT_SESSION, 'post'>
>;
export type CreateStripePortalSessionResponse = OpResponseBody<
  OpForPath<typeof SUBSCRIPTION_ROUTES.PORTAL_SESSION, 'post'>
>;
export type SyncStripeCheckoutSessionBody = OpRequestBody<
  OpForPath<typeof SUBSCRIPTION_ROUTES.SYNC_CHECKOUT_SESSION, 'post'>
>;
export type ChangeSubscriptionPlanBody = OpRequestBody<
  OpForPath<typeof SUBSCRIPTION_ROUTES.CHANGE, 'post'>
>;

export async function fetchSubscriptions(
  fetcher: ApiFetcher,
): Promise<SubscriptionsListResponse> {
  const get = fetcher.path(SUBSCRIPTION_ROUTES.LIST).method('get').create();
  const { data } = await get({});
  return data;
}

export async function fetchSubscriptionPlans(
  fetcher: ApiFetcher,
): Promise<SubscriptionPlansResponse> {
  const get = fetcher.path(SUBSCRIPTION_ROUTES.PLANS).method('get').create();
  const { data } = await get({});
  return data;
}

export async function createStripeCheckoutSession(
  fetcher: ApiFetcher,
  body: CreateStripeCheckoutSessionBody,
): Promise<CreateSubscriptionCheckoutSessionResponse> {
  const post = fetcher
    .path(SUBSCRIPTION_ROUTES.CHECKOUT_SESSION)
    .method('post')
    .create();
  const { data } = await post(body as never);
  return data;
}

export async function createStripePortalSession(
  fetcher: ApiFetcher,
): Promise<CreateStripePortalSessionResponse> {
  const post = fetcher
    .path(SUBSCRIPTION_ROUTES.PORTAL_SESSION)
    .method('post')
    .create();
  const { data } = await post({});
  return data;
}

export async function syncStripeCheckoutSession(
  fetcher: ApiFetcher,
  body: SyncStripeCheckoutSessionBody,
): Promise<void> {
  const post = fetcher
    .path(SUBSCRIPTION_ROUTES.SYNC_CHECKOUT_SESSION)
    .method('post')
    .create();
  await post(body as never);
}

export async function cancelSubscription(fetcher: ApiFetcher): Promise<void> {
  const post = fetcher.path(SUBSCRIPTION_ROUTES.CANCEL).method('post').create();
  await post({});
}

export async function resumeSubscription(fetcher: ApiFetcher): Promise<void> {
  const post = fetcher.path(SUBSCRIPTION_ROUTES.RESUME).method('post').create();
  await post({});
}

export async function changeSubscriptionPlan(
  fetcher: ApiFetcher,
  body: ChangeSubscriptionPlanBody,
): Promise<void> {
  const post = fetcher.path(SUBSCRIPTION_ROUTES.CHANGE).method('post').create();
  await post(body as never);
}
