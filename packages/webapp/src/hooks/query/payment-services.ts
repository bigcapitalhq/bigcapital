// @ts-nocheck
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
  UseQueryResult,
} from 'react-query';
import useApiRequest from '../useRequest';
import { transformToCamelCase, transfromToSnakeCase } from '@/utils';

const PaymentServicesQueryKey = 'PaymentServices';
const PaymentServicesStateQueryKey = 'PaymentServicesState';

// # Get payment services.
// -----------------------------------------
export interface GetPaymentServicesResponse {}
/**
 * Retrieves the integrated payment services.
 * @param {UseQueryOptions<GetPaymentServicesResponse, Error>} options
 * @returns {UseQueryResult<GetPaymentServicesResponse, Error>}
 */
export const useGetPaymentServices = (
  options?: UseQueryOptions<GetPaymentServicesResponse, Error>,
): UseQueryResult<GetPaymentServicesResponse, Error> => {
  const apiRequest = useApiRequest();

  return useQuery<GetPaymentServicesResponse, Error>(
    [PaymentServicesQueryKey],
    () =>
      apiRequest
        .get('/payment-services')
        .then(
          (response) =>
            transformToCamelCase(
              response.data?.payment_services,
            ) as GetPaymentServicesResponse,
        ),
    {
      ...options,
    },
  );
};

// # Get payment services state.
// -----------------------------------------
export interface GetPaymentServicesStateResponse {
  stripe: {
    isStripeAccountCreated: boolean;
    isStripePaymentEnabled: boolean;
    isStripePayoutEnabled: boolean;
    isStripeEnabled: boolean;
    isStripeServerConfigured: boolean;
    stripeAccountId: string | null;
    stripePaymentMethodId: number | null;
    stripeCurrencies: string[];
    stripePublishableKey: string;
    stripeAuthLink: string;
    stripeRedirectUrl: string;
  };
}
/**
 * Retrieves the state of payment services.
 * @param {UseQueryOptions<GetPaymentServicesStateResponse, Error>} options
 * @returns {UseQueryResult<GetPaymentServicesStateResponse, Error>}
 */
export const useGetPaymentServicesState = (
  options?: UseQueryOptions<GetPaymentServicesStateResponse, Error>,
): UseQueryResult<GetPaymentServicesStateResponse, Error> => {
  const apiRequest = useApiRequest();

  return useQuery<GetPaymentServicesStateResponse, Error>(
    [PaymentServicesStateQueryKey],
    () =>
      apiRequest
        .get('/payment-services/state')
        .then(
          (response) =>
            transformToCamelCase(
              response.data?.data,
            ) as GetPaymentServicesStateResponse,
        ),
    {
      ...options,
    },
  );
};

// # Update payment method
// -----------------------------------------
interface UpdatePaymentMethodResponse {
  id: number;
  message: string;
}
interface UpdatePaymentMethodValues {
  paymentMethodId: string | number;
  values: {
    name: string;
    bankAccountId: number;
    clearingAccountId: number;
  };
}
/**
 * Updates a payment method.
 * @returns {UseMutationResult<UpdatePaymentMethodResponse, Error, UpdatePaymentMethodValues, unknown>}
 */
export const useUpdatePaymentMethod = (): UseMutationResult<
  UpdatePaymentMethodResponse,
  Error,
  UpdatePaymentMethodValues,
  unknown
> => {
  const apiRequest = useApiRequest();
  const queryClient = useQueryClient();

  return useMutation<
    UpdatePaymentMethodResponse,
    Error,
    UpdatePaymentMethodValues,
    unknown
  >(
    (data: UpdatePaymentMethodValues) =>
      apiRequest
        .post(
          `/payment-services/${data.paymentMethodId}`,
          transfromToSnakeCase(data.values),
        )
        .then((response) => response.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(PaymentServicesStateQueryKey);
        queryClient.invalidateQueries(PaymentServicesQueryKey);
      },
    },
  );
};

// # Get payment method
// -----------------------------------------
interface GetPaymentMethodResponse {}
/**
 * Retrieves a specific payment method.
 * @param {number} paymentMethodId - The ID of the payment method.
 * @returns {UseQueryResult<GetPaymentMethodResponse, Error>}
 */
export const useGetPaymentMethod = (
  paymentMethodId: number,
  options?: UseQueryOptions<GetPaymentMethodResponse, Error>,
): UseQueryResult<GetPaymentMethodResponse, Error> => {
  const apiRequest = useApiRequest();

  return useQuery<GetPaymentMethodResponse, Error>(
    [PaymentServicesQueryKey, paymentMethodId],
    () =>
      apiRequest
        .get(`/payment-services/${paymentMethodId}`)
        .then(
          (res) =>
            transformToCamelCase(res.data?.data) as GetPaymentMethodResponse,
        ),
    options,
  );
};

// # Delete payment method
// -----------------------------------------
interface DeletePaymentMethodValues {
  paymentMethodId: number;
}
export const useDeletePaymentMethod = (
  options?: UseMutationOptions<void, Error, DeletePaymentMethodValues>,
): UseMutationResult<void, Error, DeletePaymentMethodValues> => {
  const apiRequest = useApiRequest();
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeletePaymentMethodValues>(
    ({ paymentMethodId }) => {
      return apiRequest
        .delete(`/payment-services/${paymentMethodId}`)
        .then((res) => res.data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(PaymentServicesStateQueryKey);
      },
      ...options,
    },
  );
};
