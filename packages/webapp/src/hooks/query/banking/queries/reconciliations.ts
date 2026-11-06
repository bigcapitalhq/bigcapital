import {
  createBankReconciliation,
  deleteBankReconciliation,
  fetchBankReconciliation,
  fetchBankReconciliations,
  finishBankReconciliation,
  undoBankReconciliation,
  updateBankReconciliation,
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
  BankReconciliationDetailResponse,
  BankReconciliationsListResponse,
  CreateBankReconciliationBody,
  FinishBankReconciliationBody,
  UndoBankReconciliationBody,
  UpdateBankReconciliationBody,
} from '@bigcapital/sdk-ts';
import type { QueryClient } from '@tanstack/react-query';

const invalidateReconciliation = (
  queryClient: QueryClient,
  accountId?: number,
  reconciliationId?: number,
) => {
  if (accountId) {
    queryClient.invalidateQueries({
      queryKey: bankingKeys.reconciliations(accountId),
    });
  }
  if (reconciliationId) {
    queryClient.invalidateQueries({
      queryKey: bankingKeys.reconciliation(reconciliationId),
    });
  }
};

export function useBankReconciliations(
  accountId: number,
  options?: UseQueryOptions<BankReconciliationsListResponse, Error>,
): UseQueryResult<BankReconciliationsListResponse, Error> {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...options,
    queryKey: bankingKeys.reconciliations(accountId),
    queryFn: () => fetchBankReconciliations(fetcher, { accountId }),
    enabled: Boolean(accountId),
  });
}

export function useBankReconciliation(
  reconciliationId: number | null | undefined,
  options?: UseQueryOptions<BankReconciliationDetailResponse, Error>,
): UseQueryResult<BankReconciliationDetailResponse, Error> {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...options,
    queryKey: bankingKeys.reconciliation(reconciliationId ?? undefined),
    queryFn: () => fetchBankReconciliation(fetcher, reconciliationId as number),
    enabled: Boolean(reconciliationId),
  });
}

export function useCreateBankReconciliation(
  options?: UseMutationOptions<
    BankReconciliationDetailResponse,
    Error,
    CreateBankReconciliationBody
  >,
): UseMutationResult<
  BankReconciliationDetailResponse,
  Error,
  CreateBankReconciliationBody
> {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useMutation({
    ...options,
    mutationFn: (body) => createBankReconciliation(fetcher, body),
    onSuccess: (data, variables, context, mutation) => {
      invalidateReconciliation(
        queryClient,
        data.reconciliation.accountId,
        data.reconciliation.id,
      );
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}

export function useUpdateBankReconciliation(
  options?: UseMutationOptions<
    BankReconciliationDetailResponse,
    Error,
    { id: number; body: UpdateBankReconciliationBody }
  >,
): UseMutationResult<
  BankReconciliationDetailResponse,
  Error,
  { id: number; body: UpdateBankReconciliationBody }
> {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useMutation({
    ...options,
    mutationFn: ({ id, body }) => updateBankReconciliation(fetcher, id, body),
    onSuccess: (data, variables, context, mutation) => {
      invalidateReconciliation(
        queryClient,
        data.reconciliation.accountId,
        data.reconciliation.id,
      );
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}

export function useFinishBankReconciliation(
  options?: UseMutationOptions<
    BankReconciliationDetailResponse,
    Error,
    { id: number; body: FinishBankReconciliationBody }
  >,
): UseMutationResult<
  BankReconciliationDetailResponse,
  Error,
  { id: number; body: FinishBankReconciliationBody }
> {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useMutation({
    ...options,
    mutationFn: ({ id, body }) => finishBankReconciliation(fetcher, id, body),
    onSuccess: (data, variables, context, mutation) => {
      invalidateReconciliation(
        queryClient,
        data.reconciliation.accountId,
        data.reconciliation.id,
      );
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}

export function useUndoBankReconciliation(
  options?: UseMutationOptions<
    BankReconciliationDetailResponse,
    Error,
    { id: number; body: UndoBankReconciliationBody }
  >,
): UseMutationResult<
  BankReconciliationDetailResponse,
  Error,
  { id: number; body: UndoBankReconciliationBody }
> {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useMutation({
    ...options,
    mutationFn: ({ id, body }) => undoBankReconciliation(fetcher, id, body),
    onSuccess: (data, variables, context, mutation) => {
      invalidateReconciliation(
        queryClient,
        data.reconciliation.accountId,
        data.reconciliation.id,
      );
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}

export function useDeleteBankReconciliation(
  options?: UseMutationOptions<void, Error, number>,
): UseMutationResult<void, Error, number> {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useMutation({
    ...options,
    mutationFn: (id) => deleteBankReconciliation(fetcher, id),
    onSuccess: (data, id, context, mutation) => {
      queryClient.invalidateQueries({
        queryKey: bankingKeys.reconciliations(),
      });
      queryClient.invalidateQueries({
        queryKey: bankingKeys.reconciliation(id),
      });
      options?.onSuccess?.(data, id, context, mutation);
    },
  });
}
