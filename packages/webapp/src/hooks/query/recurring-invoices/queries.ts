import {
  fetchRecurringInvoices,
  fetchRecurringInvoice,
  createRecurringInvoice,
  editRecurringInvoice,
  deleteRecurringInvoice,
  pauseRecurringInvoice,
  resumeRecurringInvoice,
  generateRecurringInvoiceNow,
  fetchRecurringInvoiceInvoices,
  fetchRecurringInvoiceState,
} from '@bigcapital/sdk-ts';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';
import { invoicesKeys } from '../invoices/query-keys';
import { recurringInvoicesKeys } from './query-keys';
import type {
  RecurringInvoicesListResponse,
  RecurringInvoice,
  CreateRecurringInvoiceBody,
  EditRecurringInvoiceBody,
  GetRecurringInvoicesQuery,
  RecurringInvoiceInvoicesResponse,
  GetRecurringInvoiceInvoicesQuery,
  RecurringInvoiceStateResponse,
  GenerateRecurringInvoiceResponse,
} from '@bigcapital/sdk-ts';

function commonInvalidateQueries(
  queryClient: ReturnType<typeof useQueryClient>,
) {
  queryClient.invalidateQueries({ queryKey: recurringInvoicesKeys.all() });
  queryClient.invalidateQueries({ queryKey: invoicesKeys.all() });
}

export function useRecurringInvoices(
  query?: GetRecurringInvoicesQuery,
  props?: UseQueryOptions<RecurringInvoicesListResponse, Error>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...props,
    queryKey: recurringInvoicesKeys.list(query),
    queryFn: () => fetchRecurringInvoices(fetcher, query),
  });
}

export function useRecurringInvoice(
  id: number | null | undefined,
  props?: Omit<
    UseQueryOptions<RecurringInvoice, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...props,
    queryKey: recurringInvoicesKeys.detail(id),
    queryFn: () => fetchRecurringInvoice(fetcher, id as number),
    enabled: id != null && (props?.enabled ?? true),
  });
}

export function useCreateRecurringInvoice(
  props?: UseMutationOptions<
    RecurringInvoice,
    Error,
    CreateRecurringInvoiceBody
  >,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (values: CreateRecurringInvoiceBody) =>
      createRecurringInvoice(fetcher, values),
    onSuccess: (data, variables, _onMutateResult, context) => {
      commonInvalidateQueries(queryClient);
      props?.onSuccess?.(data, variables, _onMutateResult, context);
    },
  });
}

export function useEditRecurringInvoice(
  props?: UseMutationOptions<
    RecurringInvoice,
    Error,
    [number, EditRecurringInvoiceBody]
  >,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: ([id, values]: [number, EditRecurringInvoiceBody]) =>
      editRecurringInvoice(fetcher, id, values),
    onSuccess: (data, variables, _onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: recurringInvoicesKeys.detail(variables[0]),
      });
      commonInvalidateQueries(queryClient);
      props?.onSuccess?.(data, variables, _onMutateResult, context);
    },
  });
}

export function useDeleteRecurringInvoice(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number) => deleteRecurringInvoice(fetcher, id),
    onSuccess: (data, variables, _onMutateResult, context) => {
      commonInvalidateQueries(queryClient);
      props?.onSuccess?.(data, variables, _onMutateResult, context);
    },
  });
}

export function usePauseRecurringInvoice(
  props?: UseMutationOptions<RecurringInvoice, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number) => pauseRecurringInvoice(fetcher, id),
    onSuccess: (data, variables, _onMutateResult, context) => {
      commonInvalidateQueries(queryClient);
      props?.onSuccess?.(data, variables, _onMutateResult, context);
    },
  });
}

export function useResumeRecurringInvoice(
  props?: UseMutationOptions<RecurringInvoice, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number) => resumeRecurringInvoice(fetcher, id),
    onSuccess: (data, variables, _onMutateResult, context) => {
      commonInvalidateQueries(queryClient);
      props?.onSuccess?.(data, variables, _onMutateResult, context);
    },
  });
}

export function useGenerateRecurringInvoiceNow(
  props?: UseMutationOptions<GenerateRecurringInvoiceResponse, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number) => generateRecurringInvoiceNow(fetcher, id),
    onSuccess: (data, variables, _onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: recurringInvoicesKeys.invoices(variables),
      });
      commonInvalidateQueries(queryClient);
      props?.onSuccess?.(data, variables, _onMutateResult, context);
    },
  });
}

export function useRecurringInvoiceInvoices(
  id: number | null | undefined,
  query?: GetRecurringInvoiceInvoicesQuery,
  props?: Omit<
    UseQueryOptions<RecurringInvoiceInvoicesResponse, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...props,
    queryKey: recurringInvoicesKeys.invoices(id, query),
    queryFn: () => fetchRecurringInvoiceInvoices(fetcher, id as number, query),
    enabled: id != null && (props?.enabled ?? true),
  });
}

export function useRecurringInvoiceState(
  props?: UseQueryOptions<RecurringInvoiceStateResponse, Error>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...props,
    queryKey: recurringInvoicesKeys.state(),
    queryFn: () => fetchRecurringInvoiceState(fetcher),
  });
}
