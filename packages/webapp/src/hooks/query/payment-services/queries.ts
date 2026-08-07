import {
  fetchGetPaymentServices,
  fetchGetPaymentServicesState,
  fetchGetPaymentService,
  fetchUpdatePaymentMethod,
  fetchDeletePaymentMethod,
  type GetPaymentServicesResponse,
  type GetPaymentServicesStateResponse,
  type GetPaymentServiceResponse,
  type UpdatePaymentMethodResponse,
} from '@bigcapital/sdk-ts';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
  UseQueryResult,
  UseMutationResult,
} from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';
import { paymentServicesKeys } from './query-keys';

// # Get payment services.
// -----------------------------------------
/**
 * Retrieves the integrated payment services.
 */
export const useGetPaymentServices = (
  options?: UseQueryOptions<GetPaymentServicesResponse, Error>,
): UseQueryResult<GetPaymentServicesResponse, Error> => {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery<GetPaymentServicesResponse, Error>({
    queryKey: paymentServicesKeys.list(),
    queryFn: () => fetchGetPaymentServices(fetcher),
    ...options,
  });
};

// # Get payment services state.
// -----------------------------------------
/**
 * Retrieves the state of payment services.
 */
export const useGetPaymentServicesState = (
  options?: UseQueryOptions<GetPaymentServicesStateResponse, Error>,
): UseQueryResult<GetPaymentServicesStateResponse, Error> => {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery<GetPaymentServicesStateResponse, Error>({
    queryKey: paymentServicesKeys.state(),
    queryFn: () =>
      fetchGetPaymentServicesState(
        fetcher,
      ) as Promise<GetPaymentServicesStateResponse>,
    ...options,
  });
};

// # Update payment method
// -----------------------------------------
export interface UpdatePaymentMethodValues {
  paymentMethodId: string | number;
  values: {
    name?: string;
    bankAccountId?: number;
    clearingAccountId?: number;
  };
}

/**
 * Updates a payment method.
 */
export const useUpdatePaymentMethod = (): UseMutationResult<
  UpdatePaymentMethodResponse,
  Error,
  UpdatePaymentMethodValues,
  unknown
> => {
  const fetcher = useApiFetcher();
  const queryClient = useQueryClient();

  return useMutation<
    UpdatePaymentMethodResponse,
    Error,
    UpdatePaymentMethodValues,
    unknown
  >({
    mutationFn: (data: UpdatePaymentMethodValues) =>
      fetchUpdatePaymentMethod(fetcher, Number(data.paymentMethodId), {
        ...(data.values.name && { name: data.values.name }),
        options: {
          ...(data.values.bankAccountId && {
            bankAccountId: data.values.bankAccountId,
          }),
          ...(data.values.clearingAccountId && {
            clearningAccountId: data.values.clearingAccountId,
          }),
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentServicesKeys.state() });
      queryClient.invalidateQueries({ queryKey: paymentServicesKeys.list() });
    },
  });
};

// # Get payment method
// -----------------------------------------
/**
 * Retrieves a specific payment method.
 */
export const useGetPaymentMethod = (
  paymentMethodId: number,
  options?: Omit<
    UseQueryOptions<GetPaymentServiceResponse, Error>,
    'queryKey' | 'queryFn'
  >,
): UseQueryResult<GetPaymentServiceResponse, Error> => {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery<GetPaymentServiceResponse, Error>({
    queryKey: paymentServicesKeys.detail(paymentMethodId),
    queryFn: () => fetchGetPaymentService(fetcher, paymentMethodId),
    enabled: !!paymentMethodId,
    ...options,
  });
};

// # Delete payment method
// -----------------------------------------
export interface DeletePaymentMethodValues {
  paymentMethodId: number;
}

export const useDeletePaymentMethod = (
  options?: UseMutationOptions<void, Error, DeletePaymentMethodValues>,
): UseMutationResult<void, Error, DeletePaymentMethodValues> => {
  const fetcher = useApiFetcher();
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeletePaymentMethodValues>({
    mutationFn: ({ paymentMethodId }) =>
      fetchDeletePaymentMethod(fetcher, paymentMethodId).then(() => undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentServicesKeys.state() });
    },
    ...options,
  });
};
