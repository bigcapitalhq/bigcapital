// @ts-ignore
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
      ...options,
    },
  );
}

interface ChangeMainSubscriptionPlanValues {
  variantId: string;
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
    ChangeMainSubscriptionPlanValues,
    Error,
    ChangeMainSubscriptionPlanResponse
  >(
    (values) =>
      apiRequest.post(`/subscription/change`, values).then((res) => res.data),
    {
      ...options,
    },
  );
}

interface GetSubscriptionsQuery {}
interface GetSubscriptionsResponse {}

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
    ['SUBSCRIPTIONS'],
    (values) => apiRequest.get(`/subscription`).then((res) => res.data),
    {
      ...options,
    },
  );
}
