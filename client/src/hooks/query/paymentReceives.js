import { useMutation, useQuery, useQueryClient } from 'react-query';
import ApiService from 'services/ApiService';

const transformPaymentReceives = (response) => {
  return {};
};

/**
 * Retrieve accounts list.
 */
export function usePaymentReceives(query, props) {
  return useQuery(
    ['PAYMENT_RECEIVES', query],
    () =>
      ApiService.get('sales/payment_receives', { params: query }).then(
        transformPaymentReceives,
      ),
    {
      initialData: [],
      ...props,
    },
  );
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
  return useQuery(
    ['PAYMENT_RECEIVE', id],
    () =>
      ApiService.get(`sales/payment_receives/${id}`).then(
        transformPaymentReceives,
      ),
    {
      initialData: [],
      ...props,
    },
  );
}
