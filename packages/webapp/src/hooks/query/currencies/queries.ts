import {
  fetchCurrencies,
  createCurrency,
  editCurrency,
  deleteCurrency,
} from '@bigcapital/sdk-ts';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';
import { currenciesKeys } from './query-keys';
import type {
  CurrenciesListResponse,
  CreateCurrencyBody,
  EditCurrencyBody,
} from '@bigcapital/sdk-ts';

export function useCreateCurrency(
  props?: UseMutationOptions<void, Error, CreateCurrencyBody>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (values: CreateCurrencyBody) => createCurrency(fetcher, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: currenciesKeys.all() });
    },
  });
}

export function useEditCurrency(
  props?: UseMutationOptions<void, Error, [number, EditCurrencyBody]>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: ([currencyId, values]: [number, EditCurrencyBody]) =>
      editCurrency(fetcher, currencyId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: currenciesKeys.all() });
    },
  });
}

export function useDeleteCurrency(
  props?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (currencyCode: string) => deleteCurrency(fetcher, currencyCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: currenciesKeys.all() });
    },
  });
}

export function useCurrencies(
  props?: Omit<UseQueryOptions<CurrenciesListResponse>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: currenciesKeys.all(),
    queryFn: () => fetchCurrencies(fetcher),
  });
}
