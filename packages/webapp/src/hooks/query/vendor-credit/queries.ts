import {
  fetchVendorCredits,
  fetchVendorCredit,
  createVendorCredit,
  editVendorCredit,
  deleteVendorCredit,
  openVendorCredit,
  bulkDeleteVendorCredits,
  validateBulkDeleteVendorCredits,
  fetchVendorCreditRefunds,
  createRefundVendorCredit,
  fetchRefundVendorCreditTransaction,
  deleteRefundVendorCredit,
  fetchVendorCreditToApplyBills,
  applyVendorCreditToBills,
  fetchAppliedBillsToVendorCredit,
  deleteAppliedBillToVendorCredit,
} from '@bigcapital/sdk-ts';
import {
  useQuery,
  useQueryClient,
  useMutation,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';
import { accountsKeys } from '../accounts/query-keys';
import { billsKeys } from '../bills/query-keys';
import { cashflowAccountsKeys } from '../cashflow-accounts/query-keys';
import { financialReportsKeys } from '../FinancialReports/query-keys';
import { itemsKeys } from '../items/query-keys';
import { organizationKeys } from '../organization/query-keys';
import { settingsKeys } from '../settings/query-keys';
import { vendorsKeys } from '../vendors/query-keys';
import { vendorCreditsKeys } from './query-keys';
import type {
  CreateVendorCreditBody,
  EditVendorCreditBody,
  GetVendorCreditsQuery,
  BulkDeleteVendorCreditsBody,
  CreateRefundVendorCreditBody,
  ApplyVendorCreditToBillsBody,
  ValidateBulkDeleteVendorCreditsResponse,
  VendorCreditRefund,
  VendorCreditAppliedBill,
  VendorCreditsListResponse,
  VendorCredit,
} from '@bigcapital/sdk-ts';

const commonInvalidateQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  queryClient.invalidateQueries({ queryKey: vendorCreditsKeys.all() });
  queryClient.invalidateQueries({ queryKey: itemsKeys.all() });
  queryClient.invalidateQueries({ queryKey: vendorsKeys.all() });
  queryClient.invalidateQueries({ queryKey: accountsKeys.all() });
  queryClient.invalidateQueries({ queryKey: settingsKeys.vendorCredits() });
  queryClient.invalidateQueries({
    queryKey: vendorCreditsKeys.refund(null).slice(0, 1),
  });
  queryClient.invalidateQueries({
    queryKey: vendorCreditsKeys.refundTransaction(null).slice(0, 1),
  });
  queryClient.invalidateQueries({
    queryKey: vendorCreditsKeys.reconcile(null).slice(0, 1),
  });
  queryClient.invalidateQueries({
    queryKey: vendorCreditsKeys.reconciles(null).slice(0, 1),
  });
  queryClient.invalidateQueries({ queryKey: billsKeys.all() });
  queryClient.invalidateQueries({
    queryKey: cashflowAccountsKeys.transactionsInfinity().slice(0, 1),
  });
  queryClient.invalidateQueries({ queryKey: financialReportsKeys.all() });
  queryClient.invalidateQueries({
    queryKey: financialReportsKeys.transactionsByReference().slice(0, 1),
  });
  queryClient.invalidateQueries({
    queryKey: organizationKeys.mutateAbilities(),
  });
};

export function useCreateVendorCredit(
  props?: UseMutationOptions<void, Error, CreateVendorCreditBody>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (values: CreateVendorCreditBody) =>
      createVendorCredit(fetcher, values),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

export function useEditVendorCredit(
  props?: UseMutationOptions<void, Error, [number, EditVendorCreditBody]>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: ([id, values]: [number, EditVendorCreditBody]) =>
      editVendorCredit(fetcher, id, values),
    onSuccess: (_data, [id]) => {
      commonInvalidateQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: vendorCreditsKeys.detail(id) });
    },
  });
}

export function useDeleteVendorCredit(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number) => deleteVendorCredit(fetcher, id),
    onSuccess: (_data, id) => {
      commonInvalidateQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: vendorCreditsKeys.detail(id) });
    },
  });
}

export function useBulkDeleteVendorCredits(
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
    }) => bulkDeleteVendorCredits(fetcher, { ids, skipUndeletable }),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

export function useValidateBulkDeleteVendorCredits(
  props?: UseMutationOptions<
    ValidateBulkDeleteVendorCreditsResponse,
    Error,
    number[]
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useMutation({
    ...props,
    mutationFn: (ids: number[]) =>
      validateBulkDeleteVendorCredits(fetcher, {
        ids,
      } as BulkDeleteVendorCreditsBody),
  });
}

/**
 * Retrieve vendor credit notes list with pagination meta.
 */
export function useVendorCredits(
  query?: GetVendorCreditsQuery,
  props?: UseQueryOptions<VendorCreditsListResponse, Error>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...props,
    queryKey: vendorCreditsKeys.list(query),
    queryFn: () => fetchVendorCredits(fetcher, query),
  });
}

export function useVendorCredit(
  id: number | null | undefined,
  props?: Omit<UseQueryOptions<VendorCredit>, 'queryKey' | 'queryFn'>,
  _requestProps?: unknown,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...props,
    queryKey: vendorCreditsKeys.detail(id),
    queryFn: () => fetchVendorCredit(fetcher, id!),
    enabled: id != null,
  });
}

export function useRefreshVendorCredits() {
  const queryClient = useQueryClient();

  return {
    refresh: () => {
      queryClient.invalidateQueries({ queryKey: vendorCreditsKeys.all() });
    },
  };
}

export function useCreateRefundVendorCredit(
  props?: UseMutationOptions<
    void,
    Error,
    [number, CreateRefundVendorCreditBody]
  >,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: ([id, values]: [number, CreateRefundVendorCreditBody]) =>
      createRefundVendorCredit(fetcher, id, values),
    onSuccess: (_data, [id]) => {
      commonInvalidateQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: vendorCreditsKeys.detail(id) });
    },
  });
}

export function useDeleteRefundVendorCredit(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number) => deleteRefundVendorCredit(fetcher, id),
    onSuccess: (_data, id) => {
      commonInvalidateQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: vendorCreditsKeys.refund(id) });
    },
  });
}

export function useRefundVendorCredit(
  id: number | null | undefined,
  props?: Omit<UseQueryOptions<VendorCreditRefund[]>, 'queryKey' | 'queryFn'>,
  _requestProps?: unknown,
) {
  const fetcher = useApiFetcher();

  return useQuery({
    ...props,
    queryKey: vendorCreditsKeys.refund(id),
    queryFn: () => fetchVendorCreditRefunds(fetcher, id!),
    enabled: id != null,
  });
}

export function useOpenVendorCredit(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number) => openVendorCredit(fetcher, id),
    onSuccess: (_data, id) => {
      commonInvalidateQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: vendorCreditsKeys.detail(id) });
    },
  });
}

export function useCreateReconcileVendorCredit(
  props?: UseMutationOptions<
    void,
    Error,
    [number, ApplyVendorCreditToBillsBody]
  >,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: ([id, values]: [number, ApplyVendorCreditToBillsBody]) =>
      applyVendorCreditToBills(fetcher, id, values),
    onSuccess: (_data, [id]) => {
      commonInvalidateQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: vendorCreditsKeys.detail(id) });
    },
  });
}

export function useReconcileVendorCredit(
  id: number | null | undefined,
  props?: Omit<UseQueryOptions<unknown>, 'queryKey' | 'queryFn'>,
  _requestProps?: unknown,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: vendorCreditsKeys.reconcile(id),
    queryFn: () => fetchVendorCreditToApplyBills(fetcher, id!),
    enabled: id != null,
  });
}

export function useReconcileVendorCredits(
  id: number | null | undefined,
  props?: Omit<
    UseQueryOptions<VendorCreditAppliedBill[]>,
    'queryKey' | 'queryFn'
  >,
  _requestProps?: unknown,
) {
  const fetcher = useApiFetcher();

  return useQuery({
    ...props,
    queryKey: vendorCreditsKeys.reconciles(id),
    queryFn: () => fetchAppliedBillsToVendorCredit(fetcher, id!),
    enabled: id != null,
  });
}

export function useDeleteReconcileVendorCredit(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (vendorCreditAppliedBillId: number) =>
      deleteAppliedBillToVendorCredit(fetcher, vendorCreditAppliedBillId),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

export function useRefundVendorCreditTransaction(
  id: number | null | undefined,
  props?: Omit<UseQueryOptions<unknown>, 'queryKey' | 'queryFn'>,
  _requestProps?: unknown,
) {
  const fetcher = useApiFetcher();

  return useQuery({
    ...props,
    queryKey: vendorCreditsKeys.refundTransaction(id),
    queryFn: () => fetchRefundVendorCreditTransaction(fetcher, id!),
    enabled: id != null,
  });
}
