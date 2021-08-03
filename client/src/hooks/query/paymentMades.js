import { useMutation, useQueryClient } from 'react-query';
import { useRequestQuery } from '../useQueryRequest';
import { transformPagination } from 'utils';
import useApiRequest from '../useRequest';
import t from './types';

const commonInvalidateQueries = (client) => {
  // Invalidate payment mades.
  client.invalidateQueries(t.PAYMENT_MADES);

  // Invalidate payment made new entries.
  client.invalidateQueries(t.PAYMENT_MADE_NEW_ENTRIES);
  client.invalidateQueries(t.PAYMENT_MADE_EDIT_PAGE);

  // Invalidate financial reports.
  client.invalidateQueries(t.FINANCIAL_REPORT);

  // Invalidate accounts.
  client.invalidateQueries(t.ACCOUNTS);
  client.invalidateQueries(t.ACCOUNT);

  // Invalidate bills.
  client.invalidateQueries(t.BILLS);
  client.invalidateQueries(t.BILL);

  // Invalidate vendors.
  client.invalidateQueries(t.VENDORS);
  client.invalidateQueries(t.VENDOR);
};

/**
 * Retrieve payment mades list.
 */
export function usePaymentMades(query, props) {
  return useRequestQuery(
    [t.PAYMENT_MADES, query],
    { url: 'purchases/bill_payments', params: query },
    {
      select: (res) => ({
        paymentMades: res.data.bill_payments,
        pagination: transformPagination(res.data.pagination),
        filterMeta: res.data.filter_meta,
      }),
      defaultData: {
        paymentMades: [],
        pagination: {},
        filterMeta: {},
      },
      ...props,
    },
  );
}

/**
 * Creates payment made.
 */
export function useCreatePaymentMade(props) {
  const client = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (values) => apiRequest.post('purchases/bill_payments', values),
    {
      onSuccess: (res, values) => {
        // Common invalidation queries.
        commonInvalidateQueries(client);
      },
      ...props,
    },
  );
}

/**
 * Edits payment made.
 */
export function useEditPaymentMade(props) {
  const client = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) => apiRequest.post(`purchases/bill_payments/${id}`, values),
    {
      onSuccess: (res, [id, values]) => {
        // Common invalidation queries.
        commonInvalidateQueries(client);

        // Invalidate specific payment made.
        client.invalidateQueries([t.PAYMENT_MADE, id]);
      },
      ...props,
    },
  );
}

/**
 * Deletes payment made.
 */
export function useDeletePaymentMade(props) {
  const client = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (id) => apiRequest.delete(`purchases/bill_payments/${id}`),
    {
      onSuccess: (res, id) => {
        // Common invalidation queries.
        commonInvalidateQueries(client);

        // Invalidate specific payment made.
        client.invalidateQueries([t.PAYMENT_MADE, id]);
      },
      ...props,
    },
  );
}

/**
 * Retrieve specific payment made.
 */
export function usePaymentMadeEditPage(id, props) {
  return useRequestQuery(
    [t.PAYMENT_MADE_EDIT_PAGE, id],
    {
      method: 'get',
      url: `purchases/bill_payments/${id}/edit-page`,
    },
    {
      select: (res) => ({
        paymentMade: res.data.bill_payment,
        entries: res.data.entries,
      }),
      defaultData: {
        paymentMade: {},
        entries: [],
      },
      ...props,
    },
  );
}

/**
 * Retreive payment made new page entries.
 * @param {number} vendorId -
 */
export function usePaymentMadeNewPageEntries(vendorId, props) {
  return useRequestQuery(
    [t.PAYMENT_MADE_NEW_ENTRIES, vendorId],
    {
      method: 'get',
      url: `purchases/bill_payments/new-page/entries`,
      params: { vendor_id: vendorId },
    },
    {
      select: (res) => res.data.entries,
      defaultData: [],
      ...props,
    },
  );
}

export function useRefreshPaymentMades() {
  const queryClient = useQueryClient();

  return {
    refresh: () => {
      queryClient.invalidateQueries(t.PAYMENT_MADES);
    },
  };
}