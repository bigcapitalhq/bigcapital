import { useMutation, useQuery, useQueryClient } from 'react-query';
import ApiService from 'services/ApiService';

const transformPaymentMades = (response) => {
  return {};
};

/**
 * Retrieve payment mades list.
 */
export function usePaymentMades(query, props) {
  return useQuery(
    ['PAYMENT_MADES', query],
    () =>
      ApiService.get('sales/payment_mades', { params: query }).then(
        transformPaymentMades,
      ),
    {
      initialData: [],
      ...props,
    },
  );
}

/**
 * Creates payment made.
 */
export function useCreatePaymentMade(props) {
  const client = useQueryClient();

  return useMutation(
    (values) => ApiService.post('sales/payment_mades', values),
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
    (id, values) => ApiService.post(`sales/payment_mades/${id}`, values),
    {
      onSuccess: () => {
        client.invalidateQueries('PAYMENT_MADES');
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
    (id, values) => ApiService.delete(`sales/payment_mades/${id}`, values),
    {
      onSuccess: () => {
        client.invalidateQueries('PAYMENT_MADES');
      },
      ...props,
    },
  );
}

/**
 * Retrieve specific payment made.
 */
export function usePaymentMade(id, props) {
  return useQuery(
    ['PAYMENT_MADE', id],
    () =>
      ApiService.get(`sales/payment_mades/${id}`).then(
        transformPaymentMades,
      ),
    {
      initialData: [],
      ...props,
    },
  );
}
