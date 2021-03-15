import { useMutation, useQueryClient } from 'react-query';
import { defaultTo } from 'lodash';
import { useQueryTenant } from '../useQueryTenant';
import { transformPagination } from 'utils';
import useApiRequest from '../useRequest';

const defaultPagination = {
  pageSize: 12,
  page: 0,
  pagesCount: 0,
};
/**
 * Creates a new exchange rate.
 */
export function useCreateExchangeRate(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((values) => apiRequest.post('exchange_rates', values), {
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
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) => apiRequest.post(`exchange_rates/${id}`, values),
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
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.delete(`exchange_rates/${id}`), {
    onSuccess: () => {
      queryClient.invalidateQueries('EXCHANGES_RATES');
    },
    ...props,
  });
}

/**
 * Retrieve the exchange rate list.
 */
export function useExchangeRates(query, props) {
  const apiRequest = useApiRequest();

  const states = useQueryTenant(
    ['EXCHANGES_RATES', query],
    () => apiRequest.get('exchange_rates', { params: query }),
    {
      select: (res) => ({
        exchangesRates: res.data.exchange_rates.results,
        pagination: transformPagination(res.data.exchange_rates.pagination),
        filterMeta: res.data.filter_meta,
      }),
      ...props,
    },
  );

  return {
    ...states,
    data: defaultTo(states.data, {
      exchangesRates: [],
      pagination: {
        page: 1,
        pageSize: 12,
        total: 0,
      },
      filterMeta: {},
    }),
  };
}
