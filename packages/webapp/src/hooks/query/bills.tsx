// @ts-nocheck
import { useQueryClient, useMutation } from 'react-query';
import { useRequestQuery } from '../useQueryRequest';
import { transformPagination } from '@/utils';
import useApiRequest from '../useRequest';
import t from './types';

const commonInvalidateQueries = (queryClient) => {
  // Invalidate bills.
  queryClient.invalidateQueries(t.BILLS);

  // Invalidate items.
  queryClient.invalidateQueries(t.ITEMS);
  queryClient.invalidateQueries(t.ITEM);

  // Invalidate vendors.
  queryClient.invalidateQueries([t.VENDORS]);
  queryClient.invalidateQueries(t.VENDOR);

  // Invalidate accounts.
  queryClient.invalidateQueries(t.ACCOUNTS);
  queryClient.invalidateQueries(t.ACCOUNT);

  // Invalidate landed cost.
  queryClient.invalidateQueries(t.LANDED_COST);
  queryClient.invalidateQueries(t.LANDED_COST_TRANSACTION);

  // Invalidate reconcile.
  queryClient.invalidateQueries(t.RECONCILE_VENDOR_CREDIT);
  queryClient.invalidateQueries(t.RECONCILE_VENDOR_CREDITS);

  // Invalidate financial reports.
  queryClient.invalidateQueries(t.FINANCIAL_REPORT);

  // Invalidate the transactions by reference.
  queryClient.invalidateQueries(t.TRANSACTIONS_BY_REFERENCE);

  // Invalidate items associated bills transactions.
  queryClient.invalidateQueries(t.ITEMS_ASSOCIATED_WITH_BILLS);

  // Invalidate item warehouses.
  queryClient.invalidateQueries(t.ITEM_WAREHOUSES_LOCATION);

  // Invalidate mutate base currency abilities.
  queryClient.invalidateQueries(t.ORGANIZATION_MUTATE_BASE_CURRENCY_ABILITIES);
};

/**
 * Creates a new sale invoice.
 */
export function useCreateBill(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((values) => apiRequest.post('purchases/bills', values), {
    onSuccess: (res, values) => {
      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Edits the given sale invoice.
 */
export function useEditBill(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) => apiRequest.post(`purchases/bills/${id}`, values),
    {
      onSuccess: (res, [id, values]) => {
        // Common invalidate queries.
        commonInvalidateQueries(queryClient);

        // Invalidate bill query.
        queryClient.invalidateQueries([t.BILL, id]);
      },
      ...props,
    },
  );
}

/**
 * Marks the given bill as open.
 */
export function useOpenBill(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.post(`purchases/bills/${id}/open`), {
    onSuccess: (res, id) => {
      // Common invalidate queries.
      commonInvalidateQueries(queryClient);

      // Invalidate bill query.
      queryClient.invalidateQueries([t.BILL, id]);
    },
    ...props,
  });
}

/**
 * Deletes the given sale invoice.
 */
export function useDeleteBill(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.delete(`purchases/bills/${id}`), {
    onSuccess: (res, id) => {
      // Common invalidate queries.
      commonInvalidateQueries(queryClient);

      // Invalidate bill query.
      queryClient.invalidateQueries([t.BILL, id]);
    },
    ...props,
  });
}

const transformBillsResponse = (response) => ({
  bills: response.data.bills,
  pagination: transformPagination(response.data.pagination),
  filterMeta: response.data.filter_meta,
});

/**
 * Retrieve sale invoices list with pagination meta.
 */
export function useBills(query, props) {
  return useRequestQuery(
    [t.BILLS, query],
    {
      method: 'get',
      url: 'purchases/bills',
      params: query,
    },
    {
      select: transformBillsResponse,
      defaultData: {
        bills: [],
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
 * Retrieve bill details of the given bill id.
 * @param {number} id - Bill id.
 */
export function useBill(id, props) {
  return useRequestQuery(
    [t.BILL, id],
    { method: 'get', url: `/purchases/bills/${id}` },
    {
      select: (res) => res.data.bill,
      defaultData: {},
      ...props,
    },
  );
}

/**
 * Retrieve the due bills of the given vendor id.
 * @param {number} vendorId -
 */
export function useDueBills(vendorId, props) {
  return useRequestQuery(
    [t.BILLS, t.BILLS_DUE, vendorId],
    {
      method: 'get',
      url: 'purchases/bills/due',
      params: { vendor_id: vendorId },
    },
    {
      select: (res) => res.data.bills,
      defaultData: [],
      ...props,
    },
  );
}

export function useRefreshBills() {
  const queryClient = useQueryClient();

  return {
    refresh: () => {
      queryClient.invalidateQueries(t.BILLS);
    },
  };
}

export function useBillPaymentTransactions(id, props) {
  return useRequestQuery(
    [t.BILLS_PAYMENT_TRANSACTIONS, id],
    {
      method: 'get',
      url: `purchases/bills/${id}/payment-transactions`,
    },
    {
      select: (res) => res.data.data,
      defaultData: [],
      ...props,
    },
  );
}
