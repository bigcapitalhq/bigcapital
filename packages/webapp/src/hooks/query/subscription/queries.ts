import {
  fetchSubscriptions,
  fetchSubscriptionPlans,
  fetchBillingOverview,
  createStripeCheckoutSession,
  createStripePortalSession,
  syncStripeCheckoutSession,
  cancelSubscription,
  resumeSubscription,
  changeSubscriptionPlan,
} from '@bigcapital/sdk-ts';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';
import { subscriptionKeys } from './query-keys';
import type {
  SubscriptionsListResponse,
  SubscriptionPlansResponse,
  BillingOverviewResponse,
  ChangeSubscriptionPlanBody,
  CreateStripeCheckoutSessionBody,
  CreateSubscriptionCheckoutSessionResponse,
  CreateStripePortalSessionResponse,
  SyncStripeCheckoutSessionBody,
} from '@bigcapital/sdk-ts';

export function useCancelMainSubscription(
  options?: UseMutationOptions<void, Error, void>,
): UseMutationResult<void, Error, void> {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    mutationFn: () => cancelSubscription(fetcher),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.all() });
    },
    ...options,
  });
}

export function useResumeMainSubscription(
  options?: UseMutationOptions<void, Error, void>,
): UseMutationResult<void, Error, void> {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    mutationFn: () => resumeSubscription(fetcher),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.all() });
    },
    ...options,
  });
}

export function useChangeSubscriptionPlan(
  options?: UseMutationOptions<void, Error, ChangeSubscriptionPlanBody>,
): UseMutationResult<void, Error, ChangeSubscriptionPlanBody> {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    mutationFn: (values: ChangeSubscriptionPlanBody) =>
      changeSubscriptionPlan(fetcher, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.all() });
    },
    ...options,
  });
}

export function useGetSubscriptions(
  options?: UseQueryOptions<SubscriptionsListResponse, Error>,
): UseQueryResult<SubscriptionsListResponse, Error> {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    queryKey: subscriptionKeys.list(),
    queryFn: () => fetchSubscriptions(fetcher),
    ...options,
  });
}

/**
 * Derived subscription-status flags for the current organization.
 * Backed by the `useGetSubscriptions` query cache (single shared fetch).
 */
export function useSubscription(slug = 'main') {
  const { data, isLoading, isFetched } = useGetSubscriptions();
  const subscription = data?.subscriptions?.find((s) => s.slug === slug);
  return {
    subscription,
    isLoading,
    isFetched,
    isSubscriptionActive: !!subscription?.active,
    isSubscriptionInactive: !!subscription?.inactive,
    isSubscriptionOnTrial: !!subscription?.onTrial,
  };
}

/**
 * The Bigcapital Cloud plan catalog.
 */
export function useGetSubscriptionPlans(
  options?: UseQueryOptions<SubscriptionPlansResponse, Error>,
): UseQueryResult<SubscriptionPlansResponse, Error> {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    queryKey: subscriptionKeys.plans(),
    queryFn: () => fetchSubscriptionPlans(fetcher),
    ...options,
  });
}

/**
 * Stripe billing details (payment method, invoices, next payment).
 */
export function useGetBillingOverview(
  options?: UseQueryOptions<BillingOverviewResponse, Error>,
): UseQueryResult<BillingOverviewResponse, Error> {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    queryKey: subscriptionKeys.billingOverview(),
    queryFn: () => fetchBillingOverview(fetcher),
    ...options,
  });
}

/**
 * Creates a hosted Stripe Checkout session for the given plan.
 */
export function useCreateSubscriptionCheckoutSession(
  options?: UseMutationOptions<
    CreateSubscriptionCheckoutSessionResponse,
    Error,
    CreateStripeCheckoutSessionBody
  >,
): UseMutationResult<
  CreateSubscriptionCheckoutSessionResponse,
  Error,
  CreateStripeCheckoutSessionBody
> {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useMutation({
    mutationFn: (values) => createStripeCheckoutSession(fetcher, values),
    ...options,
  });
}

/**
 * Creates a Stripe Customer Portal session.
 */
export function useCreateStripePortalSession(
  options?: UseMutationOptions<CreateStripePortalSessionResponse, Error, void>,
): UseMutationResult<CreateStripePortalSessionResponse, Error, void> {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useMutation({
    mutationFn: () => createStripePortalSession(fetcher),
    ...options,
  });
}

/**
 * Synchronizes a completed Checkout Session after the Stripe redirect.
 */
export function useSyncStripeCheckoutSession(
  options?: UseMutationOptions<void, Error, SyncStripeCheckoutSessionBody>,
): UseMutationResult<void, Error, SyncStripeCheckoutSessionBody> {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useMutation({
    mutationFn: (values) => syncStripeCheckoutSession(fetcher, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.all() });
    },
    ...options,
  });
}
