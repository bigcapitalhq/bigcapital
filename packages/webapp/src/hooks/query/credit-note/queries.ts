import {
  fetchCreditNotes,
  fetchCreditNote,
  fetchCreditNoteState,
  fetchCreditNoteRefunds,
  fetchRefundCreditNoteTransaction,
  fetchCreditNoteAssociatedInvoicesToApply,
  fetchAppliedInvoices,
  createCreditNote,
  editCreditNote,
  deleteCreditNote,
  openCreditNote,
  validateBulkDeleteCreditNotes,
  bulkDeleteCreditNotes,
  createRefundCreditNote,
  deleteRefundCreditNote,
  applyCreditNoteToInvoices,
  deleteApplyCreditNoteToInvoices,
} from '@bigcapital/sdk-ts';
import {
  useQueryClient,
  useMutation,
  useQuery,
  UseMutationOptions,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';
import { useRequestPdf } from '../../useRequestPdf';
import { accountsKeys } from '../accounts/query-keys';
import { cashflowAccountsKeys } from '../cashflow-accounts/query-keys';
import { customersKeys } from '../customers/query-keys';
import { financialReportsKeys } from '../FinancialReports/query-keys';
import { invoicesKeys } from '../invoices/query-keys';
import { itemsKeys } from '../items/query-keys';
import { organizationKeys } from '../organization/query-keys';
import { settingsKeys } from '../settings/query-keys';
import { creditNotesKeys } from './query-keys';
import type { CreditNotesListResponse } from '@bigcapital/sdk-ts';
import type {
  CreditNote,
  CreateCreditNoteBody,
  EditCreditNoteBody,
  CreateRefundCreditNoteBody,
  ApplyCreditNoteToInvoicesBody,
  ValidateBulkDeleteCreditNotesResponse,
} from '@bigcapital/sdk-ts';

const commonInvalidateQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  // Invalidate credit note.
  queryClient.invalidateQueries({ queryKey: creditNotesKeys.all() });

  // Invalidate items.
  queryClient.invalidateQueries({ queryKey: itemsKeys.all() });

  // Invalidate customers.
  queryClient.invalidateQueries({ queryKey: customersKeys.all() });

  // Invalidate accounts.
  queryClient.invalidateQueries({ queryKey: accountsKeys.all() });

  // Invalidate settings.
  queryClient.invalidateQueries({ queryKey: settingsKeys.creditNotes() });

  // Invalidate refund credit
  queryClient.invalidateQueries({
    queryKey: creditNotesKeys.refund(null).slice(0, 1),
  });
  queryClient.invalidateQueries({
    queryKey: creditNotesKeys.refundTransaction(null).slice(0, 1),
  });

  // Invalidate reconcile.
  queryClient.invalidateQueries({
    queryKey: creditNotesKeys.reconcile(null).slice(0, 1),
  });
  queryClient.invalidateQueries({
    queryKey: creditNotesKeys.reconciles(null).slice(0, 1),
  });

  // Invalidate invoices.
  queryClient.invalidateQueries({ queryKey: invoicesKeys.all() });

  // Invalidate cashflow accounts.
  queryClient.invalidateQueries({
    queryKey: cashflowAccountsKeys.transactionsInfinity().slice(0, 1),
  });

  // Invalidate financial reports.
  queryClient.invalidateQueries({ queryKey: financialReportsKeys.all() });

  // Invalidate transactions by reference.
  queryClient.invalidateQueries({
    queryKey: financialReportsKeys.transactionsByReference().slice(0, 1),
  });

  // Invalidate mutate base currency abilities.
  queryClient.invalidateQueries({
    queryKey: organizationKeys.mutateAbilities(),
  });
};

export function useCreateCreditNote(
  props?: UseMutationOptions<void, Error, CreateCreditNoteBody>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (values: CreateCreditNoteBody) =>
      createCreditNote(fetcher, values),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

export function useEditCreditNote(
  props?: UseMutationOptions<void, Error, [number, EditCreditNoteBody]>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: ([id, values]: [number, EditCreditNoteBody]) =>
      editCreditNote(fetcher, id, values),
    onSuccess: (_data, [id]) => {
      commonInvalidateQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: creditNotesKeys.detail(id) });
    },
  });
}

export function useDeleteCreditNote(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number) => deleteCreditNote(fetcher, id),
    onSuccess: (_data, id) => {
      commonInvalidateQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: creditNotesKeys.detail(id) });
    },
  });
}

export function useBulkDeleteCreditNotes(
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
    }) => bulkDeleteCreditNotes(fetcher, { ids, skipUndeletable }),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

export function useValidateBulkDeleteCreditNotes(
  props?: UseMutationOptions<
    ValidateBulkDeleteCreditNotesResponse,
    Error,
    number[]
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useMutation({
    ...props,
    mutationFn: (ids: number[]) =>
      validateBulkDeleteCreditNotes(fetcher, { ids, skipUndeletable: false }),
  });
}

export function useCreditNotes(
  query?: Record<string, unknown>,
  props?: Omit<
    UseQueryOptions<CreditNotesListResponse>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: creditNotesKeys.list(query),
    queryFn: () =>
      (
        fetchCreditNotes as (
          f: ReturnType<typeof useApiFetcher>,
          q?: Record<string, unknown>,
        ) => Promise<CreditNotesListResponse>
      )(fetcher, query),
  });
}

export function useCreditNote(
  id: number | null | undefined,
  props?: Omit<UseQueryOptions<CreditNote>, 'queryKey' | 'queryFn'>,
  _requestProps?: Record<string, unknown>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: creditNotesKeys.detail(id),
    queryFn: () => fetchCreditNote(fetcher, id!),
    enabled: id != null,
  });
}

export function useRefreshCreditNotes() {
  const queryClient = useQueryClient();

  return {
    refresh: () => {
      queryClient.invalidateQueries({ queryKey: creditNotesKeys.all() });
    },
  };
}

export function useCreateRefundCreditNote(
  props?: UseMutationOptions<void, Error, [number, CreateRefundCreditNoteBody]>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: ([id, values]: [number, CreateRefundCreditNoteBody]) =>
      createRefundCreditNote(fetcher, id, values),
    onSuccess: (_data, [id]) => {
      commonInvalidateQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: creditNotesKeys.detail(id) });
    },
  });
}

export function useDeleteRefundCreditNote(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (refundCreditId: number) =>
      deleteRefundCreditNote(fetcher, refundCreditId),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

export function useRefundCreditNote(
  id: number | null | undefined,
  props?: Omit<
    UseQueryOptions<Awaited<ReturnType<typeof fetchCreditNoteRefunds>>>,
    'queryKey' | 'queryFn'
  >,
  _requestProps?: Record<string, unknown>,
) {
  const fetcher = useApiFetcher();
  return useQuery({
    ...props,
    queryKey: creditNotesKeys.refund(id),
    queryFn: () => fetchCreditNoteRefunds(fetcher, id!),
    enabled: id != null,
  });
}

export function useOpenCreditNote(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number) => openCreditNote(fetcher, id),
    onSuccess: (_data, id) => {
      commonInvalidateQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: creditNotesKeys.detail(id) });
    },
  });
}

export function useReconcileCreditNote(
  id: number | null | undefined,
  props?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof fetchCreditNoteAssociatedInvoicesToApply>>
    >,
    'queryKey' | 'queryFn'
  >,
  _requestProps?: Record<string, unknown>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: creditNotesKeys.reconcile(id),
    queryFn: () => fetchCreditNoteAssociatedInvoicesToApply(fetcher, id!),
    enabled: id != null,
  });
}

export function useCreateReconcileCreditNote(
  props?: UseMutationOptions<
    void,
    Error,
    [number, ApplyCreditNoteToInvoicesBody]
  >,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: ([id, values]: [number, ApplyCreditNoteToInvoicesBody]) =>
      applyCreditNoteToInvoices(fetcher, id, values),
    onSuccess: (_data, [id]) => {
      commonInvalidateQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: creditNotesKeys.detail(id) });
    },
  });
}

export function useReconcileCreditNotes(
  id: number | null | undefined,
  props?: Omit<
    UseQueryOptions<Awaited<ReturnType<typeof fetchAppliedInvoices>>>,
    'queryKey' | 'queryFn'
  >,
  _requestProps?: Record<string, unknown>,
) {
  const fetcher = useApiFetcher();
  return useQuery({
    ...props,
    queryKey: creditNotesKeys.reconciles(id),
    queryFn: () => fetchAppliedInvoices(fetcher, id!),
    enabled: id != null,
  });
}

export function useDeleteReconcileCredit(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (applyCreditToInvoicesId: number) =>
      deleteApplyCreditNoteToInvoices(fetcher, applyCreditToInvoicesId),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

export function useRefundCreditTransaction(
  id: number | null | undefined,
  props?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof fetchRefundCreditNoteTransaction>>
    >,
    'queryKey' | 'queryFn'
  >,
  _requestProps?: Record<string, unknown>,
) {
  const fetcher = useApiFetcher();
  return useQuery({
    ...props,
    queryKey: creditNotesKeys.refundTransaction(id),
    queryFn: () => fetchRefundCreditNoteTransaction(fetcher, id!),
    enabled: id != null,
  });
}

export function usePdfCreditNote(creditNoteId: number | string) {
  return useRequestPdf({ url: `credit-notes/${creditNoteId}` });
}

export interface CreditNoteStateResponse {
  defaultTemplateId: number;
}

export function useGetCreditNoteState(
  options?: UseQueryOptions<CreditNoteStateResponse, Error>,
): UseQueryResult<CreditNoteStateResponse, Error> {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery<CreditNoteStateResponse, Error>({
    ...options,
    queryKey: creditNotesKeys.state(),
    queryFn: () =>
      fetchCreditNoteState(fetcher) as Promise<CreditNoteStateResponse>,
  });
}
