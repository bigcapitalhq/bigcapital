import {
  fetchVendors,
  fetchVendor,
  createVendor,
  editVendor,
  deleteVendor,
  validateBulkDeleteVendors,
  bulkDeleteVendors,
  editVendorOpeningBalance,
} from '@bigcapital/sdk-ts';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';
import { vendorsKeys } from './query-keys';
import type {
  Vendor,
  CreateVendorBody,
  EditVendorBody,
  EditVendorOpeningBalanceBody,
  ValidateBulkDeleteVendorsResponse,
} from '@bigcapital/sdk-ts';
import type { VendorsListResponse } from '@bigcapital/sdk-ts';

const commonInvalidateQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  queryClient.invalidateQueries({ queryKey: vendorsKeys.all() });
};

export function useVendors(
  query?: Record<string, unknown>,
  props?: Omit<UseQueryOptions<VendorsListResponse>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: vendorsKeys.list(query),
    queryFn: () => fetchVendors(fetcher, query),
  });
}

export function useEditVendor(
  props?: UseMutationOptions<void, Error, [number, EditVendorBody]>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: ([id, values]: [number, EditVendorBody]) =>
      editVendor(fetcher, id, values),
    onSuccess: (_data: void, [id]: [number, EditVendorBody]) => {
      queryClient.invalidateQueries({ queryKey: vendorsKeys.detail(id) });
      commonInvalidateQueries(queryClient);
    },
  });
}

export function useDeleteVendor(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number) => deleteVendor(fetcher, id),
    onSuccess: (_data: void, id: number) => {
      queryClient.invalidateQueries({ queryKey: vendorsKeys.detail(id) });
      commonInvalidateQueries(queryClient);
    },
  });
}

export function useBulkDeleteVendors(
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
    }) => bulkDeleteVendors(fetcher, { ids, skipUndeletable }),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

export function useValidateBulkDeleteVendors(
  props?: UseMutationOptions<
    ValidateBulkDeleteVendorsResponse,
    Error,
    number[]
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useMutation({
    ...props,
    mutationFn: (ids: number[]) =>
      validateBulkDeleteVendors(fetcher, {
        ids,
        skipUndeletable: false,
      }),
  });
}

export function useCreateVendor(
  props?: UseMutationOptions<void, Error, CreateVendorBody>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (values: CreateVendorBody) => createVendor(fetcher, values),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

export function useVendor(
  id: number | null | undefined,
  props?: Omit<UseQueryOptions<Vendor>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: vendorsKeys.detail(id),
    queryFn: () => fetchVendor(fetcher, id!),
    enabled: id != null,
  });
}

export function useEditVendorOpeningBalance(
  props?: UseMutationOptions<
    unknown,
    Error,
    [number, EditVendorOpeningBalanceBody]
  >,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();
  return useMutation({
    ...props,
    mutationFn: ([id, values]: [number, EditVendorOpeningBalanceBody]) =>
      editVendorOpeningBalance(fetcher, id, values),
    onSuccess: (
      _data: unknown,
      [id]: [number, EditVendorOpeningBalanceBody],
    ) => {
      queryClient.invalidateQueries({ queryKey: vendorsKeys.detail(id) });
      commonInvalidateQueries(queryClient);
    },
  });
}

export function useRefreshVendors() {
  const queryClient = useQueryClient();
  return {
    refresh: () =>
      queryClient.invalidateQueries({ queryKey: vendorsKeys.all() }),
  };
}
