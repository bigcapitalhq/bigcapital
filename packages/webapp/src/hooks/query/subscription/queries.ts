import {
  fetchSubscriptions,
  fetchLemonSubscriptions,
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
  LemonSubscriptionsListResponse,
  ChangeSubscriptionPlanBody,
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
  const { data } = useGetSubscriptions();
  const subscription = data?.subscriptions?.find((s) => s.slug === slug);
  return {
    isSubscriptionActive: !!subscription?.active,
    isSubscriptionInactive: !!subscription?.inactive,
    isSubscriptionOnTrial: !!subscription?.onTrial,
  };
}

/**
 * Lemon Squeezy subscription details (urls) for the current organization's
 * subscriptions. Fetched from the dedicated `/api/subscription/lemon` endpoint
 * so the system-subscriptions list stays lemon-free.
 */
export function useGetLemonSubscriptions(
  options?: UseQueryOptions<LemonSubscriptionsListResponse, Error>,
): UseQueryResult<LemonSubscriptionsListResponse, Error> {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    queryKey: subscriptionKeys.lemon(),
    queryFn: () => fetchLemonSubscriptions(fetcher),
    ...options,
  });
}

/**
 * The Lemon Squeezy subscription entry for the given slug (default `'main'`).
 */
export function useLemonSubscription(slug = 'main') {
  const { data } = useGetLemonSubscriptions();
  return data?.lemonSubscriptions?.find((s) => s.slug === slug);
}
