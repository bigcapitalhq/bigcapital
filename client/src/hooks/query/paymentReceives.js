import { useMutation, useQuery, useQueryClient } from 'react-query';
import { defaultTo } from 'lodash';
import ApiService from 'services/ApiService';
import { transformPagination, saveInvoke } from 'utils';

/**
 * Retrieve accounts list.
 */
export function usePaymentReceives(query, props) {
  const states = useQuery(
    ['PAYMENT_RECEIVES', query],
    () => ApiService.get('sales/payment_receives', { params: query }),
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
  }
}

/**
 * Creates payment receive.
 */
export function useCreatePaymentReceive(props) {
  const client = useQueryClient();

  return useMutation(
    (values) => ApiService.post('sales/payment_receives', values),
    {
      onSuccess: (data, values) => {
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
 * Edits payment receive.
 */
export function useEditPaymentReceive(props) {
  const client = useQueryClient();

  return useMutation(
    ([id, values]) => ApiService.post(`sales/payment_receives/${id}`, values),
    {
      onSuccess: (data) => {
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
 * Deletes payment receive.
 */
export function useDeletePaymentReceive(props) {
  const client = useQueryClient();

  return useMutation(
    (id) => ApiService.delete(`sales/payment_receives/${id}`),
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
  const states = useQuery(
    ['PAYMENT_RECEIVE', id],
    () => ApiService.get(`sales/payment_receives/${id}`),
    {
      select: (res) => ({
        paymentReceive: res.data.payment_receive,
        receivableEntries: res.data.receivable_entries,
      }),
      ...props
    },
  );

  return {
    ...states,
    data: defaultTo(states.data, {
      paymentReceive: {},
      receivableInvoices: {},
      paymentInvoices: {}
    }),
  }
}

/**
 * Retrieve information of payment receive in edit page.
 * @param {number} id - Payment receive id.
 */
export function usePaymentReceiveEditPage(id, props) {
  const states = useQuery(
    ['PAYMENT_RECEIVE_EDIT_PAGE', id],
    () => ApiService.get(`sales/payment_receives/${id}/edit-page`),
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
    })
  }
}
