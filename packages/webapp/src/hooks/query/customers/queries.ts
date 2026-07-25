import {
  fetchCustomers,
  fetchCustomer,
  createCustomer,
  editCustomer,
  deleteCustomer,
  validateBulkDeleteCustomers,
  bulkDeleteCustomers,
  editCustomerOpeningBalance,
} from '@bigcapital/sdk-ts';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';
import { customersKeys } from './query-keys';
import type {
  Customer,
  CreateCustomerBody,
  EditCustomerBody,
  ValidateBulkDeleteCustomersResponse,
} from '@bigcapital/sdk-ts';
import type { CustomersListResponse } from '@bigcapital/sdk-ts';

const commonInvalidateQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  queryClient.invalidateQueries({ queryKey: customersKeys.all() });
};

export function useCustomers(
  query?: Record<string, unknown>,
  props?: Omit<UseQueryOptions<CustomersListResponse>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: customersKeys.list(query),
    queryFn: () => fetchCustomers(fetcher, query),
  });
}

export function useEditCustomer(
  props?: UseMutationOptions<void, Error, [number, EditCustomerBody]>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();
  return useMutation({
    ...props,
    mutationFn: ([id, values]: [number, EditCustomerBody]) =>
      editCustomer(fetcher, id, values),
    onSuccess: (_data, [id]) => {
      queryClient.invalidateQueries({ queryKey: customersKeys.detail(id) });
      commonInvalidateQueries(queryClient);
    },
  });
}

export function useDeleteCustomer(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number) => deleteCustomer(fetcher, id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: customersKeys.detail(id) });
      commonInvalidateQueries(queryClient);
    },
  });
}

export function useBulkDeleteCustomers(
  props?: UseMutationOptions<
    void,
    Error,
    { ids: number[]; skipUndeletable?: boolean }
  >,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: ({
      ids,
      skipUndeletable = false,
    }: {
      ids: number[];
      skipUndeletable?: boolean;
    }) =>
      bulkDeleteCustomers(fetcher, {
        ids,
        skipUndeletable,
      }),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

export function useValidateBulkDeleteCustomers(
  props?: UseMutationOptions<
    ValidateBulkDeleteCustomersResponse,
    Error,
    number[]
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useMutation({
    ...props,
    mutationFn: (ids: number[]) =>
      validateBulkDeleteCustomers(fetcher, { ids, skipUndeletable: false }),
  });
}

export function useCreateCustomer(
  props?: UseMutationOptions<void, Error, CreateCustomerBody>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (values: CreateCustomerBody) => createCustomer(fetcher, values),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

export function useCustomer(
  id: number | null | undefined,
  props?: Omit<UseQueryOptions<Customer>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: customersKeys.detail(id),
    queryFn: () => fetchCustomer(fetcher, id!),
    enabled: id != null,
  });
}

export function useEditCustomerOpeningBalance(
  props?: UseMutationOptions<unknown, Error, [number, Record<string, unknown>]>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: ([id, values]: [number, Record<string, unknown>]) =>
      editCustomerOpeningBalance(
        fetcher,
        id,
        values as Parameters<typeof editCustomerOpeningBalance>[2],
      ),
    onSuccess: (_data, [id]) => {
      queryClient.invalidateQueries({ queryKey: customersKeys.detail(id) });
      commonInvalidateQueries(queryClient);
    },
  });
}

export function useRefreshCustomers() {
  const queryClient = useQueryClient();
  return {
    refresh: () =>
      queryClient.invalidateQueries({ queryKey: customersKeys.all() }),
  };
}
