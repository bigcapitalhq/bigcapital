import { useMutation, useQueryClient } from 'react-query';
import { useRequestQuery } from '../useQueryRequest';
import useApiRequest from '../useRequest';
import { transformPagination, saveInvoke } from 'utils';
import t from './types';

// Common invalidate queries.
const commonInvalidateQueries = (client) => {
  // Invalidate payment receives.
  client.invalidateQueries(t.PAYMENT_RECEIVES);
  client.invalidateQueries(t.PAYMENT_RECEIVE_EDIT_PAGE);

  // Invalidate invoices.
  client.invalidateQueries(t.SALE_INVOICES);
  client.invalidateQueries(t.SALE_INVOICE);

  // Invalidate accounts.
  client.invalidateQueries(t.ACCOUNTS);
  client.invalidateQueries(t.ACCOUNT);

  // Invalidate financial reports.
  client.invalidateQueries(t.FINANCIAL_REPORT);

  // Invalidate customers.
  client.invalidateQueries(t.CUSTOMERS);
  client.invalidateQueries(t.CUSTOMER);
};

// Transform payment receives.
const transformPaymentReceives = (res) => ({
  paymentReceives: res.data.payment_receives,
  pagination: transformPagination(res.data.pagination),
  filterMeta: res.data.filter_meta,
});

/**
 * Retrieve accounts list.
 */
export function usePaymentReceives(query, props) {
  return useRequestQuery(
    [t.PAYMENT_RECEIVES, query],
    { method: 'get', url: 'sales/payment_receives', params: query },
    {
      select: transformPaymentReceives,
      defaultData: {
        paymentReceives: [],
        pagination: { page: 1, pageSize: 20, total: 0 },
        filterMeta: {},
      },
      ...props,
    },
  );
}

/**
 * Creates payment receive.
 */
export function useCreatePaymentReceive(props) {
  const client = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (values) => apiRequest.post('sales/payment_receives', values),
    {
      onSuccess: (data, values) => {
        // Invalidate specific payment receive.
        commonInvalidateQueries(client);

        // Invalidate payment receive settings.
        client.invalidateQueries([t.SETTING, t.SETTING_PAYMENT_RECEIVES]);

        saveInvoke(props?.onSuccess, data);
      },
      ...props,
    },
  );
}

/**
 * Edits payment receive.
 */
export function useEditPaymentReceive(props) {
  const client = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) => apiRequest.post(`sales/payment_receives/${id}`, values),
    {
      onSuccess: (data, [id, values]) => {
        // Invalidate specific payment receive.
        client.invalidateQueries([t.PAYMENT_RECEIVE, id]);

        // Common invalidate queries.
        commonInvalidateQueries(client);

        saveInvoke(props?.onSuccess, data);
      },
      ...props,
    },
  );
}

/**
 * Deletes payment receive.
 */
export function useDeletePaymentReceive(props) {
  const client = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (id) => apiRequest.delete(`sales/payment_receives/${id}`),
    {
      onSuccess: (data, id) => {
        // Invalidate specific payment receive.
        client.invalidateQueries([t.PAYMENT_RECEIVE, id]);

        commonInvalidateQueries(client);

        saveInvoke(props?.onSuccess, data);
      },
      ...props,
    },
  );
}

/**
 * Retrieve specific payment receive.
 * @param {number} id - Payment receive.
 */
export function usePaymentReceive(id, props) {
  return useRequestQuery(
    [t.PAYMENT_RECEIVE, id],
    { method: 'get', url: `sales/payment_receives/${id}` },
    {
      select: (res) => res.data.payment_receive,
      defaultData: {},
      ...props,
    },
  );
}

/**
 * Retrieve information of payment receive in edit page.
 * @param {number} id - Payment receive id.
 */
export function usePaymentReceiveEditPage(id, props) {
  return useRequestQuery(
    [t.PAYMENT_RECEIVE_EDIT_PAGE, id],
    { method: 'get', url: `sales/payment_receives/${id}/edit-page` },
    {
      select: (res) => ({
        paymentReceive: res.data.payment_receive,
        entries: res.data.entries,
      }),
      defaultData: {
        paymentReceive: {},
        entries: [],
      },
      ...props,
    },
  );
}

export function useRefreshPaymentReceive() {
  const queryClient = useQueryClient();

  return {
    refresh: () => {
      queryClient.invalidateQueries(t.PAYMENT_RECEIVES);
    },
  };
}
