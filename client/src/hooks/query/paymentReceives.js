import { useMutation, useQueryClient } from 'react-query';
import { useQueryTenant } from '../useQueryTenant';
import { defaultTo } from 'lodash';
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

/**
 * Retrieve accounts list.
 */
export function usePaymentReceives(query, props) {
  const apiRequest = useApiRequest();

  const states = useQueryTenant(
    [t.PAYMENT_RECEIVES, query],
    () => apiRequest.get('sales/payment_receives', { params: query }),
    {
      select: (res) => ({
        paymentReceives: res.data.payment_receives,
        pagination: transformPagination(res.data.pagination),
        filterMeta: res.data.filter_meta,
      }),
      ...props,
    },
  );

  return {
    ...states,
    data: defaultTo(states.data, {
      paymentReceives: [],
      pagination: {
        page: 1,
        pageSize: 12,
        total: 0,
      },
      filterMeta: {},
    }),
  };
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
  const apiRequest = useApiRequest();

  const states = useQueryTenant(
    [t.PAYMENT_RECEIVE, id],
    () => apiRequest.get(`sales/payment_receives/${id}`),
    {
      select: (res) => ({
        paymentReceive: res.data.payment_receive,
      }),
      ...props,
    },
  );

  return {
    ...states,
    data: defaultTo(states.data, {}),
  };
}

/**
 * Retrieve information of payment receive in edit page.
 * @param {number} id - Payment receive id.
 */
export function usePaymentReceiveEditPage(id, props) {
  const apiRequest = useApiRequest();

  const states = useQueryTenant(
    [t.PAYMENT_RECEIVE_EDIT_PAGE, id],
    () => apiRequest.get(`sales/payment_receives/${id}/edit-page`),
    {
      select: (res) => ({
        paymentReceive: res.data.payment_receive,
        entries: res.data.entries,
      }),
      ...props,
    },
  );

  return {
    ...states,
    data: defaultTo(states.data, {
      paymentReceive: {},
      entries: [],
    }),
  };
}
