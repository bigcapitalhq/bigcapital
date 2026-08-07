import {
  fetchAccounts,
  fetchAccount,
  fetchAccountTypes,
  fetchAccountTransactions,
  createAccount,
  editAccount,
  deleteAccount,
  activateAccount,
  inactivateAccount,
  bulkDeleteAccounts,
  bulkActivateAccounts,
  bulkInactivateAccounts,
  validateBulkDeleteAccounts,
  AccountTypesList,
  AccountTransactionsList,
} from '@bigcapital/sdk-ts';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';
import { accountsKeys } from './query-keys';
import type {
  Account,
  AccountsList,
  CreateAccountBody,
  EditAccountBody,
  GetAccountsQuery,
  ValidateBulkDeleteResponse,
} from '@bigcapital/sdk-ts';

const commonInvalidateQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  queryClient.invalidateQueries({ queryKey: accountsKeys.all() });
};

export function useAccounts(
  query?: GetAccountsQuery | null,
  props?: Omit<UseQueryOptions<AccountsList>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: accountsKeys.list(query),
    queryFn: () => fetchAccounts(fetcher, query ?? {}),
  });
}

export function useAccount(
  id: number | null | undefined,
  props?: Omit<UseQueryOptions<Account>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: accountsKeys.detail(id),
    queryFn: () => fetchAccount(fetcher, id!),
    enabled: id != null,
  });
}

export function useAccountsTypes(
  props?: Omit<UseQueryOptions<AccountTypesList>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: accountsKeys.types(),
    queryFn: () => fetchAccountTypes(fetcher),
  });
}

export function useCreateAccount(
  props?: UseMutationOptions<void, Error, CreateAccountBody>,
) {
  const client = useQueryClient();
  const fetcher = useApiFetcher();
  return useMutation({
    ...props,
    mutationFn: (values: CreateAccountBody) => createAccount(fetcher, values),
    onSuccess: () => commonInvalidateQueries(client),
  });
}

export function useEditAccount(
  props?: UseMutationOptions<void, Error, [number, EditAccountBody]>,
) {
  const client = useQueryClient();
  const fetcher = useApiFetcher();
  return useMutation({
    ...props,
    mutationFn: ([id, values]: [number, EditAccountBody]) =>
      editAccount(fetcher, id, values),
    onSuccess: () => commonInvalidateQueries(client),
  });
}

export function useDeleteAccount(
  props?: UseMutationOptions<void, Error, number>,
) {
  const client = useQueryClient();
  const fetcher = useApiFetcher();
  return useMutation({
    ...props,
    mutationFn: (id: number) => deleteAccount(fetcher, id),
    onSuccess: () => commonInvalidateQueries(client),
  });
}

export function useActivateAccount(
  props?: UseMutationOptions<void, Error, number>,
) {
  const client = useQueryClient();
  const fetcher = useApiFetcher();
  return useMutation({
    ...props,
    mutationFn: (id: number) => activateAccount(fetcher, id),
    onSuccess: () => commonInvalidateQueries(client),
  });
}

export function useInactivateAccount(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();
  return useMutation({
    ...props,
    mutationFn: (id: number) => inactivateAccount(fetcher, id),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

export function useBulkDeleteAccounts(
  props?: UseMutationOptions<
    void,
    Error,
    { ids: number[]; skipUndeletable?: boolean }
  >,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();
  return useMutation({
    ...props,
    mutationFn: ({
      ids,
      skipUndeletable = false,
    }: {
      ids: number[];
      skipUndeletable?: boolean;
    }) => bulkDeleteAccounts(fetcher, { ids, skipUndeletable }),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

export function useBulkActivateAccounts(
  props?: UseMutationOptions<void, Error, { ids: number[] }>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();
  return useMutation({
    ...props,
    mutationFn: ({ ids }: { ids: number[] }) =>
      bulkActivateAccounts(fetcher, { ids }),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

export function useBulkInactivateAccounts(
  props?: UseMutationOptions<void, Error, { ids: number[] }>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();
  return useMutation({
    ...props,
    mutationFn: ({ ids }: { ids: number[] }) =>
      bulkInactivateAccounts(fetcher, { ids }),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

export function useValidateBulkDeleteAccounts(
  props?: UseMutationOptions<ValidateBulkDeleteResponse, Error, number[]>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useMutation({
    ...props,
    mutationFn: (ids: number[]) => validateBulkDeleteAccounts(fetcher, ids),
  });
}

export function useAccountTransactions(
  id: number | null | undefined,
  props?: Omit<
    UseQueryOptions<AccountTransactionsList>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: accountsKeys.transactions(id),
    queryFn: () => fetchAccountTransactions(fetcher, id!),
    enabled: id != null,
  });
}

export function useRefreshAccounts() {
  const queryClient = useQueryClient();
  return {
    refresh: () => {
      queryClient.invalidateQueries({ queryKey: accountsKeys.all() });
    },
  };
}
