// @ts-nocheck
import { useQueryClient, useMutation } from 'react-query';
import { useRequestQuery } from '../useQueryRequest';
import { transformPagination } from '@/utils';
import useApiRequest from '../useRequest';
import t from './types';

const commonInvalidateQueries = (queryClient) => {
  // Invalidate vendor credit.
  queryClient.invalidateQueries(t.VENDOR_CREDITS);
  queryClient.invalidateQueries(t.VENDOR_CREDIT);

  // Invalidate items.
  queryClient.invalidateQueries(t.ITEMS);
  queryClient.invalidateQueries(t.ITEM);

  // Invalidate vendors.
  queryClient.invalidateQueries([t.VENDORS]);
  queryClient.invalidateQueries(t.VENDOR);

  // Invalidate accounts.
  queryClient.invalidateQueries(t.ACCOUNTS);
  queryClient.invalidateQueries(t.ACCOUNT);

  // Invalidate settings.
  queryClient.invalidateQueries([t.SETTING, t.SETTING_VENDOR_CREDITS]);

  // Invalidate refund vendor credit
  queryClient.invalidateQueries(t.REFUND_VENDOR_CREDIT);
  queryClient.invalidateQueries(t.REFUND_VENDOR_CREDIT_TRANSACTION);

  // Invalidate reconcile vendor credit.
  queryClient.invalidateQueries(t.RECONCILE_VENDOR_CREDIT);
  queryClient.invalidateQueries(t.RECONCILE_VENDOR_CREDITS);

  // Invalidate bills.
  queryClient.invalidateQueries(t.BILL);
  queryClient.invalidateQueries(t.BILLS);

  // Invalidate cashflow accounts.
  queryClient.invalidateQueries(t.CASHFLOW_ACCOUNT_TRANSACTIONS_INFINITY);

  // Invalidate financial reports.
  queryClient.invalidateQueries(t.FINANCIAL_REPORT);

  // Invalidate mutate base currency abilities.
  queryClient.invalidateQueries(t.ORGANIZATION_MUTATE_BASE_CURRENCY_ABILITIES);
};

/**
 * Create a new vendor credit.
 */
export function useCreateVendorCredit(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (values) => apiRequest.post('purchases/vendor-credit', values),
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
 * Edit the given vendor credit.
 */
export function useEditVendorCredit(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) => apiRequest.post(`purchases/vendor-credit/${id}`, values),
    {
      onSuccess: (res, [id, values]) => {
        // Common invalidate queries.
        commonInvalidateQueries(queryClient);

        // Invalidate vendor credit query.
        queryClient.invalidateQueries([t.VENDOR_CREDIT, id]);
      },
      ...props,
    },
  );
}

/**
 * Delete the given vendor credit.
 */
export function useDeleteVendorCredit(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (id) => apiRequest.delete(`purchases/vendor-credit/${id}`),
    {
      onSuccess: (res, id) => {
        // Common invalidate queries.
        commonInvalidateQueries(queryClient);

        // Invalidate vendor credit query.
        queryClient.invalidateQueries([t.VENDOR_CREDIT_NOTE, id]);
      },
      ...props,
    },
  );
}

const transformVendorCreditsResponse = (response) => ({
  vendorCredits: response.data.vendor_credits,
  pagination: transformPagination(response.data.pagination),
  filterMeta: response.data.filter_meta,
});

/**
 * Retrieve vendor credit notes list with pagination meta.
 */
export function useVendorCredits(query, props) {
  return useRequestQuery(
    [t.VENDOR_CREDITS, query],
    {
      method: 'get',
      url: 'purchases/vendor-credit',
      params: query,
    },
    {
      select: transformVendorCreditsResponse,
      defaultData: {
        vendorCredits: [],
        pagination: {
          page: 1,
          page_size: 12,
          total: 0,
        },
        filterMeta: {},
      },
      ...props,
    },
  );
}

/**
 * Retrieve vendor credit detail of the given id.
 * @param {number} id
 *
 */
export function useVendorCredit(id, props, requestProps) {
  return useRequestQuery(
    [t.VENDOR_CREDIT, id],
    { method: 'get', url: `purchases/vendor-credit/${id}`, ...requestProps },
    {
      select: (res) => res.data.data,
      defaultData: {},
      ...props,
    },
  );
}

export function useRefreshVendorCredits() {
  const queryClient = useQueryClient();

  return {
    refresh: () => {
      queryClient.invalidateQueries(t.VENDOR_CREDITS);
    },
  };
}

/**
 * Create Round vendor credit
 */
export function useCreateRefundVendorCredit(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) =>
      apiRequest.post(`purchases/vendor-credit/${id}/refund`, values),
    {
      onSuccess: (res, [id, values]) => {
        // Common invalidate queries.
        commonInvalidateQueries(queryClient);

        // Invalidate credit note query.
        queryClient.invalidateQueries([t.VENDOR_CREDIT, id]);
      },
      ...props,
    },
  );
}

/**
 * Delete the given refund vendor credit.
 */
export function useDeleteRefundVendorCredit(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (id) => apiRequest.delete(`purchases/vendor-credit/refunds/${id}`),
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
export function useRefundVendorCredit(id, props, requestProps) {
  return useRequestQuery(
    [t.REFUND_VENDOR_CREDIT, id],
    {
      method: 'get',
      url: `purchases/vendor-credit/${id}/refund`,
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
 * Mark the given vendor credit  as opened.
 */
export function useOpenVendorCredit(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (id) => apiRequest.post(`purchases/vendor-credit/${id}/open`),
    {
      onSuccess: (res, id) => {
        // Common invalidate queries.
        commonInvalidateQueries(queryClient);

        // Invalidate specific.
        queryClient.invalidateQueries([t.VENDOR_CREDIT, id]);
      },
      ...props,
    },
  );
}

/**
 * Create Reconcile vendor credit.
 */
export function useCreateReconcileVendorCredit(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) =>
      apiRequest.post(`purchases/vendor-credit/${id}/apply-to-bills`, values),
    {
      onSuccess: (res, [id, values]) => {
        // Common invalidate queries.
        commonInvalidateQueries(queryClient);

        // Invalidate credit note query.
        queryClient.invalidateQueries([t.VENDOR_CREDIT, id]);
      },
      ...props,
    },
  );
}

/**
 * Retrieve reconcile vendor credit of the given id.
 * @param {number} id
 *
 */
export function useReconcileVendorCredit(id, props, requestProps) {
  return useRequestQuery(
    [t.RECONCILE_VENDOR_CREDIT, id],
    {
      method: 'get',
      url: `purchases/vendor-credit/${id}/apply-to-bills`,
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
 * Retrieve reconcile credit notes.
 */
export function useReconcileVendorCredits(id, props, requestProps) {
  return useRequestQuery(
    [t.RECONCILE_VENDOR_CREDITS, id],
    {
      method: 'get',
      url: `purchases/vendor-credit/${id}/applied-bills`,
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
 * Delete the given reconcile vendor credit.
 */
export function useDeleteReconcileVendorCredit(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (id) => apiRequest.delete(`purchases/vendor-credit/applied-to-bills/${id}`),
    {
      onSuccess: (res, id) => {
        // Common invalidate queries.
        commonInvalidateQueries(queryClient);

        // Invalidate vendor credit query.
        queryClient.invalidateQueries([t.VENDOR_CREDIT, id]);
      },
      ...props,
    },
  );
}

/**
 * Retrieve refund vendor transaction detail.
 * @param {number} id
 *
 */
export function useRefundVendorCreditTransaction(id, props, requestProps) {
  return useRequestQuery(
    [t.REFUND_VENDOR_CREDIT_TRANSACTION, id],
    {
      method: 'get',
      url: `purchases/vendor-credit/refunds/${id}`,
      ...requestProps,
    },
    {
      select: (res) => res.data.refund_credit,
      defaultData: {},
      ...props,
    },
  );
}
