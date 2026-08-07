import {
  fetchTaxRates,
  fetchTaxRate,
  createTaxRate,
  editTaxRate,
  deleteTaxRate,
  activateTaxRate,
  inactivateTaxRate,
} from '@bigcapital/sdk-ts';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';
import { taxRatesKeys } from './query-keys';
import type {
  TaxRatesListResponse,
  TaxRate,
  CreateTaxRateBody,
  EditTaxRateBody,
} from '@bigcapital/sdk-ts';

const commonInvalidateQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  queryClient.invalidateQueries({ queryKey: taxRatesKeys.all() });
};

export function useTaxRates(
  props?: Omit<UseQueryOptions<TaxRatesListResponse>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher();
  return useQuery({
    ...props,
    queryKey: taxRatesKeys.all(),
    queryFn: () => fetchTaxRates(fetcher),
  });
}

export function useTaxRate(
  taxRateId: number | null | undefined,
  props?: Omit<UseQueryOptions<TaxRate>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher();
  return useQuery({
    ...props,
    queryKey: taxRatesKeys.detail(taxRateId!),
    queryFn: () => fetchTaxRate(fetcher, taxRateId!),
    enabled: !!taxRateId,
  });
}

export function useEditTaxRate(
  props?: UseMutationOptions<void, Error, [string, EditTaxRateBody]>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();
  return useMutation({
    ...props,
    mutationFn: ([id, values]: [string, EditTaxRateBody]) =>
      editTaxRate(fetcher, id, values),
    onSuccess: (_data, [id]) => {
      commonInvalidateQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: taxRatesKeys.detail(id) });
    },
  });
}

export function useCreateTaxRate(
  props?: UseMutationOptions<void, Error, CreateTaxRateBody>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();
  return useMutation({
    ...props,
    mutationFn: (values: CreateTaxRateBody) => createTaxRate(fetcher, values),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

export function useDeleteTaxRate(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();
  return useMutation({
    ...props,
    mutationFn: (id: number) => deleteTaxRate(fetcher, id),
    onSuccess: (_data, id) => {
      commonInvalidateQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: taxRatesKeys.detail(id) });
    },
  });
}

export function useActivateTaxRate(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();
  return useMutation({
    ...props,
    mutationFn: (id: number) => activateTaxRate(fetcher, id),
    onSuccess: (_data, id) => {
      commonInvalidateQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: taxRatesKeys.detail(id) });
    },
  });
}

export function useInactivateTaxRate(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();
  return useMutation({
    ...props,
    mutationFn: (id: number) => inactivateTaxRate(fetcher, id),
    onSuccess: (_data, id) => {
      commonInvalidateQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: taxRatesKeys.detail(id) });
    },
  });
}
