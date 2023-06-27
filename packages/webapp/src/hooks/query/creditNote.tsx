// @ts-nocheck
import { useQueryClient, useMutation } from 'react-query';
import { useRequestQuery } from '../useQueryRequest';
import { transformPagination } from '@/utils';
import useApiRequest from '../useRequest';
import { useRequestPdf } from '../utils';
import t from './types';

const commonInvalidateQueries = (queryClient) => {
  // Invalidate credit note.
  queryClient.invalidateQueries(t.CREDIT_NOTES);
  queryClient.invalidateQueries(t.CREDIT_NOTE);

  // Invalidate items.
  queryClient.invalidateQueries(t.ITEMS);
  queryClient.invalidateQueries(t.ITEM);

  // Invalidate customers.
  queryClient.invalidateQueries([t.CUSTOMER]);
  queryClient.invalidateQueries(t.CUSTOMERS);

  // Invalidate accounts.
  queryClient.invalidateQueries(t.ACCOUNTS);
  queryClient.invalidateQueries(t.ACCOUNT);

  // Invalidate settings.
  queryClient.invalidateQueries([t.SETTING, t.SETTING_CREDIT_NOTES]);

  // Invalidate refund credit
  queryClient.invalidateQueries(t.REFUND_CREDIT_NOTE);
  queryClient.invalidateQueries(t.REFUND_CREDIT_NOTE_TRANSACTION);

  // Invalidate reconcile.
  queryClient.invalidateQueries(t.RECONCILE_CREDIT_NOTE);
  queryClient.invalidateQueries(t.RECONCILE_CREDIT_NOTES);

  // Invalidate invoices.
  queryClient.invalidateQueries(t.SALE_INVOICES);
  queryClient.invalidateQueries(t.SALE_INVOICE);

  // Invalidate cashflow accounts.
  queryClient.invalidateQueries(t.CASHFLOW_ACCOUNT_TRANSACTIONS_INFINITY);

  // Invalidate financial reports.
  queryClient.invalidateQueries(t.FINANCIAL_REPORT);

  // Invalidate mutate base currency abilities.
  queryClient.invalidateQueries(t.ORGANIZATION_MUTATE_BASE_CURRENCY_ABILITIES);
};

/**
 * Create a new credit note.
 */
export function useCreateCreditNote(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (values) => apiRequest.post('sales/credit_notes', values),
    {
      onSuccess: (res, values) => {
        // Common invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

/**
 * Edit the given credit note.
 */
export function useEditCreditNote(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) => apiRequest.post(`sales/credit_notes/${id}`, values),
    {
      onSuccess: (res, [id, values]) => {
        // Common invalidate queries.
        commonInvalidateQueries(queryClient);

        // Invalidate credit note query.
        queryClient.invalidateQueries([t.CREDIT_NOTE, id]);
      },
      ...props,
    },
  );
}

/**
 * Delete the given credit note.
 */
export function useDeleteCreditNote(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.delete(`sales/credit_notes/${id}`), {
    onSuccess: (res, id) => {
      // Common invalidate queries.
      commonInvalidateQueries(queryClient);

      // Invalidate vendor credit query.
      queryClient.invalidateQueries([t.CREDIT_NOTE, id]);
    },
    ...props,
  });
}

const transformCreditNotes = (res) => ({
  creditNotes: res.data.credit_notes,
  pagination: transformPagination(res.data.pagination),
  filterMeta: res.data.filter_meta,
});

/**
 * Retrieve credit notes list with pagination meta.
 */
export function useCreditNotes(query, props) {
  return useRequestQuery(
    [t.CREDIT_NOTES, query],
    { method: 'get', url: 'sales/credit_notes', params: query },
    {
      select: transformCreditNotes,
      defaultData: {
        creditNotes: [],
        pagination: {
          page: 1,
          pageSize: 20,
          total: 0,
        },
        filterMeta: {},
      },
      ...props,
    },
  );
}

/**
 * Retrieve credit note detail of the given id.
 * @param {number} id
 *
 */
export function useCreditNote(id, props, requestProps) {
  return useRequestQuery(
    [t.CREDIT_NOTE, id],
    { method: 'get', url: `sales/credit_notes/${id}`, ...requestProps },
    {
      select: (res) => res.data.credit_note,
      defaultData: {},
      ...props,
    },
  );
}

export function useRefreshCreditNotes() {
  const queryClient = useQueryClient();

  return {
    refresh: () => {
      queryClient.invalidateQueries(t.CREDIT_NOTES);
    },
  };
}

/**
 * Create Round credit note
 */
export function useCreateRefundCreditNote(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) =>
      apiRequest.post(`sales/credit_notes/${id}/refund`, values),
    {
      onSuccess: (res, [id, values]) => {
        // Common invalidate queries.
        commonInvalidateQueries(queryClient);

        // Invalidate credit note query.
        queryClient.invalidateQueries([t.CREDIT_NOTE, id]);
      },
      ...props,
    },
  );
}

/**
 * Delete the given refund credit note.
 */
export function useDeleteRefundCreditNote(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (id) => apiRequest.delete(`sales/credit_notes/refunds/${id}`),
    {
      onSuccess: (res, id) => {
        // Common invalidate queries.
        commonInvalidateQueries(queryClient);

        // Invalidate vendor credit query.
        queryClient.invalidateQueries([t.CREDIT_NOTE, id]);
      },
      ...props,
    },
  );
}

/**
 * Retrieve refund credit note detail of the given id.
 * @param {number} id
 *
 */
export function useRefundCreditNote(id, props, requestProps) {
  return useRequestQuery(
    [t.REFUND_CREDIT_NOTE, id],
    { method: 'get', url: `sales/credit_notes/${id}/refund`, ...requestProps },
    {
      select: (res) => res.data.data,
      defaultData: {},
      ...props,
    },
  );
}

/**
 * Mark the given credit note as opened.
 */
export function useOpenCreditNote(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.post(`sales/credit_notes/${id}/open`), {
    onSuccess: (res, id) => {
      // Common invalidate queries.
      commonInvalidateQueries(queryClient);

      // Invalidate specific
      queryClient.invalidateQueries([t.CREDIT_NOTE, id]);
    },
    ...props,
  });
}

/**
 * Retrieve reconcile credit note of the given id.
 * @param {number} id
 *
 */
export function useReconcileCreditNote(id, props, requestProps) {
  return useRequestQuery(
    [t.RECONCILE_CREDIT_NOTE, id],
    {
      method: 'get',
      url: `sales/credit_notes/${id}/apply-to-invoices`,
      ...requestProps,
    },
    {
      select: (res) => res.data.data,
      defaultData: [],
      ...props,
    },
  );
}

/**
 * Create Reconcile credit note.
 */
export function useCreateReconcileCreditNote(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) =>
      apiRequest.post(`sales/credit_notes/${id}/apply-to-invoices`, values),
    {
      onSuccess: (res, [id, values]) => {
        // Common invalidate queries.
        commonInvalidateQueries(queryClient);

        // Invalidate credit note query.
        queryClient.invalidateQueries([t.CREDIT_NOTE, id]);
      },
      ...props,
    },
  );
}

/**
 * Retrieve reconcile credit notes.
 */
export function useReconcileCreditNotes(id, props, requestProps) {
  return useRequestQuery(
    [t.RECONCILE_CREDIT_NOTES, id],
    {
      method: 'get',
      url: `sales/credit_notes/${id}/applied-invoices`,
      ...requestProps,
    },
    {
      select: (res) => res.data.data,
      defaultData: {},
      ...props,
    },
  );
}

/**
 * Delete the given reconcile credit note.
 */
export function useDeleteReconcileCredit(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (id) => apiRequest.delete(`sales/credit_notes/applied-to-invoices/${id}`),
    {
      onSuccess: (res, id) => {
        // Common invalidate queries.
        commonInvalidateQueries(queryClient);

        // Invalidate vendor credit query.
        queryClient.invalidateQueries([t.CREDIT_NOTE, id]);
      },
      ...props,
    },
  );
}

/**
 * Retrieve refund credit transaction detail.
 * @param {number} id
 *
 */
export function useRefundCreditTransaction(id, props, requestProps) {
  return useRequestQuery(
    [t.REFUND_CREDIT_NOTE_TRANSACTION, id],
    { method: 'get', url: `sales/credit_notes/refunds/${id}`, ...requestProps },
    {
      select: (res) => res.data.refund_credit,
      defaultData: {},
      ...props,
    },
  );
}

/**
 * Retrieve the credit note pdf document data,
 */
export function usePdfCreditNote(creditNoteId) {
  return useRequestPdf(`sales/credit_notes/${creditNoteId}`);
}
