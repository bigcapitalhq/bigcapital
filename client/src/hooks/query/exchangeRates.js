import { useQuery, useMutation, useQueryClient } from 'react-query';
import { defaultTo } from 'lodash';
import ApiService from 'services/ApiService';

/**
 * Creates a new exchange rate.
 */
export function useCreateExchangeRate(props) {
  const queryClient = useQueryClient();

  return useMutation((values) => ApiService.post('exchange_rates', values), {
    onSuccess: () => {
      queryClient.invalidateQueries('EXCHANGES_RATES');
    },
    ...props,
  });
}

/**
 * Edits the exchange rate.
 */
export function useEdiExchangeRate(props) {
  const queryClient = useQueryClient();

  return useMutation(
    ([id, values]) => ApiService.post(`exchange_rates/${id}`, values),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('EXCHANGES_RATES');
      },
      ...props,
    },
  );
}

/**
 * Deletes the exchange rate.
 */
export function useDeleteExchangeRate(props) {
  const queryClient = useQueryClient();

  return useMutation((id) => ApiService.delete(`exchange_rates/${id}`), {
    onSuccess: () => {
      queryClient.invalidateQueries('EXCHANGES_RATES');
    },
    ...props,
  });
}

// Transforms items categories.
const transformExchangesRates = (response) => {
  return {
    exchangesRates: response.data.exchange_rates.results,
    pagination: response.data.exchange_rates.pagination,
  };
};

/**
 * Retrieve the exchange rate list.
 */
export function useExchangeRates(query, props) {
  const states = useQuery(
    ['EXCHANGES_RATES', query],
    () =>
      ApiService.get('exchange_rates', { params: { query } }).then(
        transformExchangesRates,
      ),
    props,
  );

  return {
    ...states,
    data: defaultTo(states.data, {
      exchangesRates: [],
      pagination: {},
    }),
  };
}
