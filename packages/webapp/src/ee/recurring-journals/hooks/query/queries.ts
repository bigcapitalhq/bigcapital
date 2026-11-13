import {
  fetchRecurringJournals,
  fetchRecurringJournal,
  createRecurringJournal,
  editRecurringJournal,
  deleteRecurringJournal,
  pauseRecurringJournal,
  resumeRecurringJournal,
  generateRecurringJournalNow,
  fetchRecurringJournalJournals,
} from '@bigcapital/sdk-ts';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { recurringJournalsKeys } from './query-keys';
import type {
  RecurringJournalsListResponse,
  RecurringJournal,
  CreateRecurringJournalBody,
  EditRecurringJournalBody,
  GetRecurringJournalsQuery,
  RecurringJournalJournalsResponse,
  GetRecurringJournalJournalsQuery,
  GenerateRecurringJournalResponse,
} from '@bigcapital/sdk-ts';
import { accountsKeys } from '@/hooks/query/accounts/query-keys';
import { cashflowAccountsKeys } from '@/hooks/query/cashflow-accounts/query-keys';
import { financialReportsKeys } from '@/hooks/query/FinancialReports/query-keys';
import { manualJournalsKeys } from '@/hooks/query/manual-journals/query-keys';
import { settingsKeys } from '@/hooks/query/settings/query-keys';
import { useApiFetcher } from '@/hooks/useRequest';

function commonInvalidateQueries(
  queryClient: ReturnType<typeof useQueryClient>,
) {
  queryClient.invalidateQueries({ queryKey: recurringJournalsKeys.all() });
  queryClient.invalidateQueries({ queryKey: manualJournalsKeys.all() });
  queryClient.invalidateQueries({ queryKey: accountsKeys.all() });
  queryClient.invalidateQueries({ queryKey: financialReportsKeys.all() });
  queryClient.invalidateQueries({
    queryKey: cashflowAccountsKeys.transactions(),
  });
  queryClient.invalidateQueries({
    queryKey: cashflowAccountsKeys.transactionsInfinity(),
  });
  queryClient.invalidateQueries({ queryKey: settingsKeys.manualJournals() });
}

export function useRecurringJournals(
  query?: GetRecurringJournalsQuery,
  props?: UseQueryOptions<RecurringJournalsListResponse, Error>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...props,
    queryKey: recurringJournalsKeys.list(query),
    queryFn: () => fetchRecurringJournals(fetcher, query),
  });
}

export function useRecurringJournal(
  id: number | null | undefined,
  props?: Omit<
    UseQueryOptions<RecurringJournal, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...props,
    queryKey: recurringJournalsKeys.detail(id),
    queryFn: () => fetchRecurringJournal(fetcher, id as number),
    enabled: id != null && (props?.enabled ?? true),
  });
}

export function useCreateRecurringJournal(
  props?: UseMutationOptions<
    RecurringJournal,
    Error,
    CreateRecurringJournalBody
  >,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (values: CreateRecurringJournalBody) =>
      createRecurringJournal(fetcher, values),
    onSuccess: (data, variables, _onMutateResult, context) => {
      commonInvalidateQueries(queryClient);
      props?.onSuccess?.(data, variables, _onMutateResult, context);
    },
  });
}

export function useEditRecurringJournal(
  props?: UseMutationOptions<
    RecurringJournal,
    Error,
    [number, EditRecurringJournalBody]
  >,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: ([id, values]: [number, EditRecurringJournalBody]) =>
      editRecurringJournal(fetcher, id, values),
    onSuccess: (data, variables, _onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: recurringJournalsKeys.detail(variables[0]),
      });
      commonInvalidateQueries(queryClient);
      props?.onSuccess?.(data, variables, _onMutateResult, context);
    },
  });
}

export function useDeleteRecurringJournal(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number) => deleteRecurringJournal(fetcher, id),
    onSuccess: (data, variables, _onMutateResult, context) => {
      commonInvalidateQueries(queryClient);
      props?.onSuccess?.(data, variables, _onMutateResult, context);
    },
  });
}

export function usePauseRecurringJournal(
  props?: UseMutationOptions<RecurringJournal, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number) => pauseRecurringJournal(fetcher, id),
    onSuccess: (data, variables, _onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: recurringJournalsKeys.detail(variables),
      });
      commonInvalidateQueries(queryClient);
      props?.onSuccess?.(data, variables, _onMutateResult, context);
    },
  });
}

export function useResumeRecurringJournal(
  props?: UseMutationOptions<RecurringJournal, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number) => resumeRecurringJournal(fetcher, id),
    onSuccess: (data, variables, _onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: recurringJournalsKeys.detail(variables),
      });
      commonInvalidateQueries(queryClient);
      props?.onSuccess?.(data, variables, _onMutateResult, context);
    },
  });
}

export function useGenerateRecurringJournalNow(
  props?: UseMutationOptions<GenerateRecurringJournalResponse, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number) => generateRecurringJournalNow(fetcher, id),
    onSuccess: (data, variables, _onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: recurringJournalsKeys.detail(variables),
      });
      queryClient.invalidateQueries({
        queryKey: recurringJournalsKeys.journals(variables),
      });
      commonInvalidateQueries(queryClient);
      props?.onSuccess?.(data, variables, _onMutateResult, context);
    },
  });
}

export function useRecurringJournalJournals(
  id: number | null | undefined,
  query?: GetRecurringJournalJournalsQuery,
  props?: Omit<
    UseQueryOptions<RecurringJournalJournalsResponse, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...props,
    queryKey: recurringJournalsKeys.journals(id, query),
    queryFn: () => fetchRecurringJournalJournals(fetcher, id as number, query),
    enabled: id != null && (props?.enabled ?? true),
  });
}
