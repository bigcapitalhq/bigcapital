import {
  fetchExpenses,
  fetchExpense,
  createExpense,
  editExpense,
  deleteExpense,
  publishExpense,
  bulkDeleteExpenses,
  validateBulkDeleteExpenses,
} from '@bigcapital/sdk-ts';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';
import { accountsKeys } from '../accounts/query-keys';
import { cashflowAccountsKeys } from '../cashflow-accounts/query-keys';
import { customersKeys } from '../customers/query-keys';
import { financialReportsKeys } from '../FinancialReports/query-keys';
import { itemsKeys } from '../items/query-keys';
import { settingsKeys } from '../settings/query-keys';
import { vendorsKeys } from '../vendors/query-keys';
import { expensesKeys } from './query-keys';
import type {
  CreateExpenseBody,
  EditExpenseBody,
  Expense,
  GetExpensesQuery,
  ExpensesListResponse,
  BulkDeleteExpensesBody,
  ValidateBulkDeleteExpensesResponse,
} from '@bigcapital/sdk-ts';

const commonInvalidateQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  // Invalidate expenses.
  queryClient.invalidateQueries({ queryKey: expensesKeys.all() });

  // Invalidate customers.
  queryClient.invalidateQueries({ queryKey: customersKeys.all() });

  // Invalidate vendors.
  queryClient.invalidateQueries({ queryKey: vendorsKeys.all() });

  // Invalidate accounts.
  queryClient.invalidateQueries({ queryKey: accountsKeys.all() });

  // Invalidate items.
  queryClient.invalidateQueries({ queryKey: itemsKeys.all() });

  // Invalidate cashflow accounts.
  queryClient.invalidateQueries({
    queryKey: cashflowAccountsKeys.transactions(),
  });
  queryClient.invalidateQueries({
    queryKey: cashflowAccountsKeys.transactionsInfinity(),
  });

  // Invalidate settings.
  queryClient.invalidateQueries({ queryKey: settingsKeys.receipts() });

  // Invalidate financial reports.
  queryClient.invalidateQueries({ queryKey: financialReportsKeys.all() });
};

export function useCreateExpense(
  props?: UseMutationOptions<void, Error, CreateExpenseBody>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();
  return useMutation({
    ...props,
    mutationFn: (values: CreateExpenseBody) => createExpense(fetcher, values),
    onSuccess: () => {
      commonInvalidateQueries(queryClient);
    },
  });
}

export function useEditExpense(
  props?: UseMutationOptions<void, Error, [number, EditExpenseBody]>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();
  return useMutation({
    ...props,
    mutationFn: ([id, values]: [number, EditExpenseBody]) =>
      editExpense(fetcher, id, values),
    onSuccess: (_res, [id]) => {
      queryClient.invalidateQueries({ queryKey: expensesKeys.detail(id) });
      commonInvalidateQueries(queryClient);
    },
  });
}

export function useDeleteExpense(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();
  return useMutation({
    ...props,
    mutationFn: (id: number) => deleteExpense(fetcher, id),
    onSuccess: (_res, id) => {
      queryClient.invalidateQueries({ queryKey: expensesKeys.detail(id) });
      commonInvalidateQueries(queryClient);
    },
  });
}

export function usePublishExpense(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();
  return useMutation({
    ...props,
    mutationFn: (id: number) => publishExpense(fetcher, id),
    onSuccess: (_res, id) => {
      queryClient.invalidateQueries({ queryKey: expensesKeys.detail(id) });
      commonInvalidateQueries(queryClient);
    },
  });
}

export function useBulkDeleteExpenses(
  props?: UseMutationOptions<void, Error, BulkDeleteExpensesBody>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();
  return useMutation({
    ...props,
    mutationFn: ({ ids, skipUndeletable = false }: BulkDeleteExpensesBody) =>
      bulkDeleteExpenses(fetcher, { ids, skipUndeletable }),
    onSuccess: () => {
      commonInvalidateQueries(queryClient);
    },
  });
}

export function useValidateBulkDeleteExpenses(
  props?: UseMutationOptions<
    ValidateBulkDeleteExpensesResponse,
    Error,
    number[]
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useMutation({
    ...props,
    mutationFn: (ids: number[]) =>
      validateBulkDeleteExpenses(fetcher, { ids, skipUndeletable: false }),
  });
}

export function useExpenses(
  query?: GetExpensesQuery | null,
  props?: Omit<UseQueryOptions<ExpensesListResponse>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: expensesKeys.list(query ?? undefined),
    queryFn: () => fetchExpenses(fetcher, query ?? {}),
  });
}

export function useExpense(
  id: number | null | undefined,
  props?: Omit<UseQueryOptions<Expense>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: expensesKeys.detail(id),
    queryFn: () => fetchExpense(fetcher, id!),
  });
}

export function useRefreshExpenses() {
  const queryClient = useQueryClient();
  return {
    refresh: () => {
      queryClient.invalidateQueries({ queryKey: expensesKeys.all() });
    },
  };
}
