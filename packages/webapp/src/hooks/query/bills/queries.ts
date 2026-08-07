import {
  fetchBills,
  fetchBill,
  createBill,
  editBill,
  deleteBill,
  openBill,
  bulkDeleteBills,
  validateBulkDeleteBills,
  fetchDueBills,
  fetchBillPaymentTransactions,
} from '@bigcapital/sdk-ts';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';
import { billsKeys } from './query-keys';
import type {
  Bill,
  BillsListResponse,
  CreateBillBody,
  EditBillBody,
  GetBillsQuery,
  BulkDeleteBillsBody,
  BillPaymentTransactionsResponse,
} from '@bigcapital/sdk-ts';

const commonInvalidateQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  queryClient.invalidateQueries({ queryKey: billsKeys.all() });
};

export function useCreateBill(
  props?: UseMutationOptions<void, Error, CreateBillBody>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (values: CreateBillBody) => createBill(fetcher, values),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

export function useEditBill(
  props?: UseMutationOptions<void, Error, [number, EditBillBody]>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: ([id, values]: [number, EditBillBody]) =>
      editBill(fetcher, id, values),
    onSuccess: (_data, [id]) => {
      commonInvalidateQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: billsKeys.detail(id) });
    },
  });
}

export function useOpenBill(props?: UseMutationOptions<void, Error, number>) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number) => openBill(fetcher, id),
    onSuccess: (_data, id) => {
      commonInvalidateQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: billsKeys.detail(id) });
    },
  });
}

export function useDeleteBill(props?: UseMutationOptions<void, Error, number>) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number) => deleteBill(fetcher, id),
    onSuccess: (_data, id) => {
      commonInvalidateQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: billsKeys.detail(id) });
    },
  });
}

export type BulkDeleteBillsPayload = {
  ids: number[];
  skipUndeletable?: boolean;
};

function toBulkDeleteBody(
  payload: BulkDeleteBillsPayload,
): BulkDeleteBillsBody {
  return {
    ids: payload.ids,
    skipUndeletable: payload.skipUndeletable ?? false,
  };
}

export function useBulkDeleteBills(
  props?: UseMutationOptions<void, Error, BulkDeleteBillsPayload>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (payload: BulkDeleteBillsPayload) =>
      bulkDeleteBills(fetcher, toBulkDeleteBody(payload)),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

/** Response shape from bills validate-bulk-delete endpoint (see ValidateBulkDeleteResponseDto) */
export type ValidateBulkDeleteBillsResponse = {
  deletableCount: number;
  nonDeletableCount: number;
  deletableIds: number[];
  nonDeletableIds: number[];
};

export function useValidateBulkDeleteBills(
  props?: UseMutationOptions<ValidateBulkDeleteBillsResponse, Error, number[]>,
) {
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (ids: number[]) =>
      validateBulkDeleteBills(fetcher, { ids, skipUndeletable: false }),
  });
}

export function useBills(
  query?: GetBillsQuery,
  props?: Omit<UseQueryOptions<BillsListResponse>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: billsKeys.list(query),
    queryFn: () => fetchBills(fetcher, query),
  });
}

export function useBill(
  id: number | null | undefined,
  props?: Omit<UseQueryOptions<Bill>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: billsKeys.detail(id),
    queryFn: () => fetchBill(fetcher, id!),
    enabled: id != null,
  });
}

export function useDueBills(
  vendorId: number | null | undefined,
  props?: Omit<UseQueryOptions<unknown[]>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher();
  return useQuery({
    ...props,
    queryKey: billsKeys.due(vendorId),
    queryFn: () =>
      fetchDueBills(
        fetcher,
        vendorId != null ? { vendor_id: vendorId } : undefined,
      ),
  });
}

export function useRefreshBills() {
  const queryClient = useQueryClient();
  return {
    refresh: () => queryClient.invalidateQueries({ queryKey: billsKeys.all() }),
  };
}

export function useBillPaymentTransactions(
  id: number | null | undefined,
  props?: Omit<
    UseQueryOptions<BillPaymentTransactionsResponse>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: billsKeys.paymentTransactions(id),
    queryFn: () => fetchBillPaymentTransactions(fetcher, id!),
    enabled: id != null,
  });
}
