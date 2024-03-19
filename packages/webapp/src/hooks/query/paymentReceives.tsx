// @ts-nocheck
import { useMutation, useQueryClient } from 'react-query';
import { useRequestQuery } from '../useQueryRequest';
import useApiRequest from '../useRequest';
import { transformPagination, saveInvoke } from '@/utils';

import t from './types';
import { useRequestPdf } from '../useRequestPdf';

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

  // Invalidate transactions by reference.
  client.invalidateQueries(t.TRANSACTIONS_BY_REFERENCE);

  // Invalidate customers.
  client.invalidateQueries(t.CUSTOMERS);
  client.invalidateQueries(t.CUSTOMER);

  // Invalidate the cashflow transactions.
  client.invalidateQueries(t.CASH_FLOW_TRANSACTIONS);
  client.invalidateQueries(t.CASHFLOW_ACCOUNT_TRANSACTIONS_INFINITY);

  client.invalidateQueries(t.CREDIT_NOTE);
  client.invalidateQueries(t.CREDIT_NOTES);

  // Invalidate reconcile.
  client.invalidateQueries(t.RECONCILE_CREDIT_NOTE);
  client.invalidateQueries(t.RECONCILE_CREDIT_NOTES);

  // Invalidate invoices payment transactions.
  client.invalidateQueries(t.SALE_INVOICE_PAYMENT_TRANSACTIONS);
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

export function useCreateNotifyPaymentReceiveBySMS(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) =>
      apiRequest.post(`sales/payment_receives/${id}/notify-by-sms`, values),
    {
      onSuccess: (res, [id, values]) => {
        // Invalidate
        queryClient.invalidateQueries([t.NOTIFY_PAYMENT_RECEIVE_BY_SMS, id]);

        // Common invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

export function usePaymentReceiveSMSDetail(
  paymentReceiveId,
  props,
  requestProps,
) {
  return useRequestQuery(
    [t.PAYMENT_RECEIVE_SMS_DETAIL, paymentReceiveId],
    {
      method: 'get',
      url: `sales/payment_receives/${paymentReceiveId}/sms-details`,
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
 * Retrieve the payment receive pdf document data.
 * @param {number} paymentReceiveId - Payment receive id.
 */
export function usePdfPaymentReceive(paymentReceiveId) {
  return useRequestPdf({ url: `sales/payment_receives/${paymentReceiveId}` });
}

export function useSendPaymentReceiveMail(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) =>
      apiRequest.post(`sales/payment_receives/${id}/mail`, values),
    {
      onSuccess: (res, [id, values]) => {
        // Common invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

export function usePaymentReceiveDefaultOptions(paymentReceiveId, props) {
  return useRequestQuery(
    [t.PAYMENT_RECEIVE_MAIL_OPTIONS, paymentReceiveId],
    {
      method: 'get',
      url: `sales/payment_receives/${paymentReceiveId}/mail`,
    },
    {
      select: (res) => res.data.data,
      ...props,
    },
  );
}
