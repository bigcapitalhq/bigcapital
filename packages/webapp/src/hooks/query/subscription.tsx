// @ts-nocheck
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryOptions,
  UseQueryResult,
} from 'react-query';
import useApiRequest from '../useRequest';
import { transformToCamelCase } from '@/utils';

const QueryKeys = {
  Subscriptions: 'Subscriptions',
};

interface CancelMainSubscriptionValues {}
interface CancelMainSubscriptionResponse {}

/**
 * Cancels the main subscription of the current organization.
 * @param {UseMutationOptions<CreateBankRuleValues, Error, CreateBankRuleValues>} options -
 * @returns {UseMutationResult<CreateBankRuleValues, Error, CreateBankRuleValues>}TCHES
 */
export function useCancelMainSubscription(
  options?: UseMutationOptions<
    CancelMainSubscriptionValues,
    Error,
    CancelMainSubscriptionResponse
  >,
): UseMutationResult<
  CancelMainSubscriptionValues,
  Error,
  CancelMainSubscriptionResponse
> {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation<
    CancelMainSubscriptionValues,
    Error,
    CancelMainSubscriptionResponse
  >(
    (values) =>
      apiRequest.post(`/subscription/cancel`, values).then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKeys.Subscriptions);
      },
      ...options,
    },
  );
}

interface ResumeMainSubscriptionValues {}
interface ResumeMainSubscriptionResponse {}

/**
 * Resumes the main subscription of the current organization.
 * @param {UseMutationOptions<CreateBankRuleValues, Error, CreateBankRuleValues>} options -
 * @returns {UseMutationResult<CreateBankRuleValues, Error, CreateBankRuleValues>}TCHES
 */
export function useResumeMainSubscription(
  options?: UseMutationOptions<
    ResumeMainSubscriptionValues,
    Error,
    ResumeMainSubscriptionResponse
  >,
): UseMutationResult<
  ResumeMainSubscriptionValues,
  Error,
  ResumeMainSubscriptionResponse
> {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation<
    ResumeMainSubscriptionValues,
    Error,
    ResumeMainSubscriptionResponse
  >(
    (values) =>
      apiRequest.post(`/subscription/resume`, values).then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKeys.Subscriptions);
      },
      ...options,
    },
  );
}

interface ChangeMainSubscriptionPlanValues {
  variant_id: string;
}
interface ChangeMainSubscriptionPlanResponse {}

/**
 * Changese the main subscription of the current organization.
 * @param {UseMutationOptions<ChangeMainSubscriptionPlanValues, Error, ChangeMainSubscriptionPlanResponse>} options -
 * @returns {UseMutationResult<ChangeMainSubscriptionPlanValues, Error, ChangeMainSubscriptionPlanResponse>}
 */
export function useChangeSubscriptionPlan(
  options?: UseMutationOptions<
    ChangeMainSubscriptionPlanValues,
    Error,
    ChangeMainSubscriptionPlanResponse
  >,
): UseMutationResult<
  ChangeMainSubscriptionPlanValues,
  Error,
  ChangeMainSubscriptionPlanResponse
> {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation<
    ChangeMainSubscriptionPlanResponse,
    Error,
    ChangeMainSubscriptionPlanValues
  >(
    (values) =>
      apiRequest.post(`/subscription/change`, values).then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKeys.Subscriptions);
      },
      ...options,
    },
  );
}

interface LemonSubscription {
  active: boolean;
  canceled: string | null;
  canceledAt: string | null;
  canceledAtFormatted: string | null;
  cancelsAt: string | null;
  cancelsAtFormatted: string | null;
  createdAt: string;
  ended: boolean;
  endsAt: string | null;
  inactive: boolean;
  lemonSubscriptionId: string;
  lemon_urls: {
    updatePaymentMethod: string;
    customerPortal: string;
    customerPortalUpdateSubscription: string;
  };
  onTrial: boolean;
  planId: number;
  planName: string;
  planSlug: string;
  slug: string;
  startsAt: string | null;
  status: string;
  statusFormatted: string;
  tenantId: number;
  trialEndsAt: string | null;
  trialEndsAtFormatted: string | null;
  trialStartsAt: string | null;
  trialStartsAtFormatted: string | null;
  updatedAt: string;
}

interface GetSubscriptionsQuery {}
interface GetSubscriptionsResponse {
  subscriptions: Array<LemonSubscription>;
}

/**
 * Changese the main subscription of the current organization.
 * @param {UseMutationOptions<ChangeMainSubscriptionPlanValues, Error, ChangeMainSubscriptionPlanResponse>} options -
 * @returns {UseMutationResult<ChangeMainSubscriptionPlanValues, Error, ChangeMainSubscriptionPlanResponse>}
 */
export function useGetSubscriptions(
  options?: UseQueryOptions<
    GetSubscriptionsQuery,
    Error,
    GetSubscriptionsResponse
  >,
): UseQueryResult<GetSubscriptionsResponse, Error> {
  const apiRequest = useApiRequest();

  return useQuery<GetSubscriptionsQuery, Error, GetSubscriptionsResponse>(
    [QueryKeys.Subscriptions],
    (values) =>
      apiRequest
        .get(`/subscription`)
        .then((res) => transformToCamelCase(res.data)),
    {
      ...options,
    },
  );
}
