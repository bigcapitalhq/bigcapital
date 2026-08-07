import {
  createBankRule,
  deleteBankRule,
  editBankRule,
  fetchBankRule,
  fetchBankRules,
} from '@bigcapital/sdk-ts';
import {
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useApiFetcher } from '../../../useRequest';
import { bankingKeys } from '../query-keys';
import type {
  BankRuleResponse,
  BankRulesListResponse,
  CreateBankRuleBody,
  CreateBankRuleResponse,
  EditBankRuleBody,
} from '@bigcapital/sdk-ts';
import type { QueryClient } from '@tanstack/react-query';

const commonInvalidateQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: bankingKeys.rules() });
  queryClient.invalidateQueries({
    queryKey: bankingKeys.recognizedTransactionsInfinity(),
  });
};

export function useCreateBankRule(
  options?: UseMutationOptions<
    CreateBankRuleResponse,
    Error,
    CreateBankRuleBody
  >,
): UseMutationResult<CreateBankRuleResponse, Error, CreateBankRuleBody> {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...options,
    mutationFn: (values: CreateBankRuleBody) => createBankRule(fetcher, values),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

export function useEditBankRule(
  options?: UseMutationOptions<
    void,
    Error,
    { id: number; value: EditBankRuleBody }
  >,
): UseMutationResult<void, Error, { id: number; value: EditBankRuleBody }> {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...options,
    mutationFn: ({ id, value }: { id: number; value: EditBankRuleBody }) =>
      editBankRule(fetcher, id, value),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

export function useDeleteBankRule(
  options?: UseMutationOptions<void, Error, number>,
): UseMutationResult<void, Error, number> {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...options,
    mutationFn: (id: number) => deleteBankRule(fetcher, id),
    onSuccess: () => {
      commonInvalidateQueries(queryClient);
      queryClient.invalidateQueries({
        queryKey: bankingKeys.recognizedTransactionsInfinity(),
      });
    },
  });
}

export function useBankRules(
  options?: UseQueryOptions<BankRulesListResponse, Error>,
): UseQueryResult<BankRulesListResponse, Error> {
  const fetcher = useApiFetcher();

  return useQuery({
    ...options,
    queryKey: bankingKeys.rules(),
    queryFn: () => fetchBankRules(fetcher),
  });
}

export function useBankRule(
  bankRuleId: number,
  options?: Omit<UseQueryOptions<BankRuleResponse, Error>, 'queryKey'>,
): UseQueryResult<BankRuleResponse, Error> {
  const fetcher = useApiFetcher();

  return useQuery({
    ...options,
    queryKey: bankingKeys.rule(bankRuleId),
    queryFn: () => fetchBankRule(fetcher, bankRuleId),
  });
}
