import { defaultTo } from 'lodash';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import ApiService from 'services/ApiService';
import { transformPagination } from 'utils';

/**
 * Retrieve payment mades list.
 */
export function usePaymentMades(query, props) {
  const states = useQuery(
    ['PAYMENT_MADES', query],
    () => ApiService.get('purchases/bill_payments', { params: query }),
    {
      select: (res) => ({
        paymentMades: res.data.bill_payments,
        pagination: transformPagination(res.data.pagination),
        filterMeta: res.data.filter_meta,
      }),
      ...props,
    },
  );

  return {
    ...states,
    data: defaultTo(states.data, {
      paymentMades: [],
      pagination: {},
      filterMeta: {}
    }),
  };
}

/**
 * Creates payment made.
 */
export function useCreatePaymentMade(props) {
  const client = useQueryClient();

  return useMutation(
    (values) => ApiService.post('purchases/bill_payments', values),
    {
      onSuccess: () => {
        client.invalidateQueries('PAYMENT_MADES');
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

  return useMutation(
    ([id, values]) => ApiService.post(`purchases/bill_payments/${id}`, values),
    {
      onSuccess: (res, [id, values]) => {
        client.invalidateQueries('PAYMENT_MADES');
        client.invalidateQueries(['PAYMENT_MADE', id]);
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

  return useMutation(
    (id) => ApiService.delete(`purchases/bill_payments/${id}`),
    {
      onSuccess: (res, id) => {
        client.invalidateQueries('PAYMENT_MADES');
        client.invalidateQueries(['PAYMENT_MADE', id]);
      },
      ...props,
    },
  );
}

/**
 * Retrieve specific payment made.
 */
export function usePaymentMade(id, props) {
  const states = useQuery(
    ['PAYMENT_MADE', id],
    () => ApiService.get(`purchases/bill_payments/${id}`),
    {
      select: res => ({
        paymentMade: res.data.bill_payment,
        payableBills: res.data.payable_bills,
        paymentBills: res.data.payment_bills,
      }),
      ...props,
    },
  );

  return {
    ...states,
    data: defaultTo(states.data, {}),
  };
}
