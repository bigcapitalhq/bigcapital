import { useMutation, useQuery, useQueryClient } from 'react-query';
import { defaultTo } from 'lodash';
import ApiService from 'services/ApiService';
import { transformPagination } from 'utils';

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
      onSuccess: () => {
        client.invalidateQueries('PAYMENT_RECEIVES');
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
    (id, values) => ApiService.post(`sales/payment_receives/${id}`, values),
    {
      onSuccess: () => {
        client.invalidateQueries('PAYMENT_RECEIVES');
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
    (id, values) => ApiService.delete(`sales/payment_receives/${id}`, values),
    {
      onSuccess: () => {
        client.invalidateQueries('PAYMENT_RECEIVES');
      },
      ...props,
    },
  );
}

/**
 * Retrieve specific payment receive.
 */
export function usePaymentReceive(id, props) {
  const states = useQuery(
    ['PAYMENT_RECEIVE', id],
    () => ApiService.get(`sales/payment_receives/${id}`),
    props,
  );

  return {
    ...states,
    data: defaultTo(states.data, {}),
  }
}
