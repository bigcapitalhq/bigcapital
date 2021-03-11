import { useMutation, useQuery, useQueryClient } from 'react-query';
import { defaultTo } from 'lodash';
import useApiRequest from '../useRequest';
import { transformPagination, saveInvoke } from 'utils';

/**
 * Retrieve accounts list.
 */
export function usePaymentReceives(query, props) {
  const apiRequest = useApiRequest();

  const states = useQuery(
    ['PAYMENT_RECEIVES', query],
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
        client.invalidateQueries('PAYMENT_RECEIVES');
        client.invalidateQueries('SALE_INVOICE_DUE');
        client.invalidateQueries('SALE_INVOICES');
        client.invalidateQueries('SALE_INVOICE');
        client.invalidateQueries(['SETTINGS', 'PAYMENT_RECEIVES']);

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
      onSuccess: (data) => {
        client.invalidateQueries('PAYMENT_RECEIVES');
        client.invalidateQueries('SALE_INVOICE_DUE');
        client.invalidateQueries('SALE_INVOICES');
        client.invalidateQueries('SALE_INVOICE');
        client.invalidateQueries(['SETTINGS', 'PAYMENT_RECEIVES']);

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
      onSuccess: (data, [id]) => {
        client.invalidateQueries('PAYMENT_RECEIVES');
        client.invalidateQueries('SALE_INVOICE_DUE');
        client.invalidateQueries('SALE_INVOICES');
        client.invalidateQueries('SALE_INVOICE');

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

  const states = useQuery(
    ['PAYMENT_RECEIVE', id],
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

  const states = useQuery(
    ['PAYMENT_RECEIVE_EDIT_PAGE', id],
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
