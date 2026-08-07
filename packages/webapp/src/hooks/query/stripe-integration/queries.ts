import {
  fetchGetStripeConnectLink,
  fetchExchangeStripeOAuth,
  fetchCreateStripeAccountLink,
  fetchCreateStripeAccountSession,
  fetchCreateStripeAccount,
} from '@bigcapital/sdk-ts';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';
import { stripeIntegrationKeys } from './query-keys';
import type {
  GetStripeConnectLinkResponse,
  CreateStripeAccountLinkResponse,
  CreateStripeAccountSessionResponse,
  CreateStripeAccountResponse,
  CreateStripeAccountLinkBody,
  CreateStripeAccountSessionBody,
  ExchangeStripeOAuthBody,
} from '@bigcapital/sdk-ts';

// Create Stripe Account Link
// ------------------------------------
export const useCreateStripeAccountLink = (
  options?: UseMutationOptions<
    CreateStripeAccountLinkResponse,
    Error,
    CreateStripeAccountLinkBody
  >,
): UseMutationResult<
  CreateStripeAccountLinkResponse,
  Error,
  CreateStripeAccountLinkBody
> => {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useMutation({
    mutationFn: (values: CreateStripeAccountLinkBody) =>
      fetchCreateStripeAccountLink(fetcher, {
        stripeAccountId: values.stripeAccountId,
      }),
    ...options,
  });
};

// Create Stripe Account Session
// ------------------------------------
export const useCreateStripeAccountSession = (
  options?: UseMutationOptions<
    CreateStripeAccountSessionResponse,
    Error,
    CreateStripeAccountSessionBody
  >,
): UseMutationResult<
  CreateStripeAccountSessionResponse,
  Error,
  CreateStripeAccountSessionBody
> => {
  const fetcher = useApiFetcher();

  return useMutation({
    mutationFn: (values: CreateStripeAccountSessionBody) =>
      fetchCreateStripeAccountSession(fetcher, {
        account: values?.account,
      }),
    ...options,
  });
};

// Create Stripe Account
// ------------------------------------
export const useCreateStripeAccount = (
  options?: UseMutationOptions<CreateStripeAccountResponse, Error, void>,
) => {
  const fetcher = useApiFetcher();

  return useMutation({
    mutationFn: () => fetchCreateStripeAccount(fetcher),
    ...options,
  });
};

// Get Stripe Account OAuth Link
// ------------------------------------
export const useGetStripeAccountLink = (
  options?: UseQueryOptions<GetStripeConnectLinkResponse, Error>,
): UseQueryResult<GetStripeConnectLinkResponse, Error> => {
  const fetcher = useApiFetcher();

  return useQuery({
    queryKey: stripeIntegrationKeys.accountLink(),
    queryFn: () => fetchGetStripeConnectLink(fetcher),
    ...options,
  });
};

// Stripe Account OAuth Callback
// ------------------------------------
interface StripeAccountCallbackMutationResponse {
  success: boolean;
}

export const useSetStripeAccountCallback = (
  options?: UseMutationOptions<
    StripeAccountCallbackMutationResponse,
    Error,
    ExchangeStripeOAuthBody
  >,
): UseMutationResult<
  StripeAccountCallbackMutationResponse,
  Error,
  ExchangeStripeOAuthBody
> => {
  const fetcher = useApiFetcher();

  return useMutation({
    mutationFn: (values: ExchangeStripeOAuthBody) =>
      fetchExchangeStripeOAuth(fetcher, { code: values.code }).then(
        () => ({ success: true }) as StripeAccountCallbackMutationResponse,
      ),
    ...options,
  });
};
