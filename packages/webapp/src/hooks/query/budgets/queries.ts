import { fetchBudgets, fetchBudget, deleteBudget } from '@bigcapital/sdk-ts';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';
import { budgetsKeys } from './query-keys';
import type {
  BudgetsListResponse,
  Budget,
  GetBudgetsQuery,
} from '@bigcapital/sdk-ts';

const commonInvalidateQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  queryClient.invalidateQueries({ queryKey: budgetsKeys.all() });
};

export function useBudgets(
  query?: GetBudgetsQuery,
  props?: Omit<UseQueryOptions<BudgetsListResponse>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: budgetsKeys.list(query),
    queryFn: () => fetchBudgets(fetcher, query),
  });
}

export function useBudget(
  budgetId: number | null | undefined,
  props?: Omit<UseQueryOptions<Budget>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: budgetsKeys.detail(budgetId!),
    queryFn: () => fetchBudget(fetcher, budgetId!),
    enabled: !!budgetId && (props?.enabled ?? true),
  });
}

export function useDeleteBudget(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();
  return useMutation({
    ...props,
    mutationFn: (id: number) => deleteBudget(fetcher, id),
    onSuccess: (_data, id) => {
      commonInvalidateQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: budgetsKeys.detail(id) });
    },
  });
}
