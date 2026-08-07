import {
  disconnectBankAccount,
  pauseBankAccount,
  refreshBankAccount,
  resumeBankAccount,
} from '@bigcapital/sdk-ts';
import {
  UseMutationOptions,
  UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useApiFetcher } from '../../../useRequest';
import { bankingKeys } from '../query-keys';
import type {
  DisconnectBankAccountParams,
  PauseBankAccountParams,
  RefreshBankAccountParams,
} from '@bigcapital/sdk-ts';

/** Mutation variables for pause (hook uses bankAccountId for the API id). */
type PauseFeedsBankAccountValues = {
  bankAccountId: PauseBankAccountParams['id'];
};

/**
 * Pauses the feeds syncing of the bank account.
 */
export function usePauseFeedsBankAccount(
  options?: UseMutationOptions<void, Error, PauseFeedsBankAccountValues>,
): UseMutationResult<void, Error, PauseFeedsBankAccountValues> {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    mutationFn: (values: PauseFeedsBankAccountValues) =>
      pauseBankAccount(fetcher, values.bankAccountId),
    onSuccess: (_res, values) => {
      queryClient.invalidateQueries({
        queryKey: bankingKeys.summaryMeta(values.bankAccountId),
      });
    },
    ...options,
  });
}

/** Mutation variables for resume (hook uses bankAccountId for the API id). */
type ResumeFeedsBankAccountValues = {
  bankAccountId: RefreshBankAccountParams['id'];
};

/**
 * Resumes the feeds syncing of the bank account.
 */
export function useResumeFeedsBankAccount(
  options?: UseMutationOptions<void, Error, ResumeFeedsBankAccountValues>,
): UseMutationResult<void, Error, ResumeFeedsBankAccountValues> {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    mutationFn: (values: ResumeFeedsBankAccountValues) =>
      resumeBankAccount(fetcher, values.bankAccountId),
    onSuccess: (_res, values) => {
      queryClient.invalidateQueries({
        queryKey: bankingKeys.summaryMeta(values.bankAccountId),
      });
    },
    ...options,
  });
}

/** Mutation variables (UI uses bankAccountId; API path param is id). */
type DisconnectBankAccountValues = {
  bankAccountId: DisconnectBankAccountParams['id'];
};

export function useDisconnectBankAccount(
  options?: UseMutationOptions<void, Error, DisconnectBankAccountValues>,
): UseMutationResult<void, Error, DisconnectBankAccountValues> {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...options,
    mutationFn: ({ bankAccountId }: DisconnectBankAccountValues) =>
      disconnectBankAccount(fetcher, bankAccountId),
    onSuccess: (_data, values) => {
      queryClient.invalidateQueries({
        queryKey: bankingKeys.summaryMeta(values.bankAccountId),
      });
    },
  });
}

/** Mutation variables (UI uses bankAccountId; API path param is id). */
type UpdateBankAccountValues = {
  bankAccountId: RefreshBankAccountParams['id'];
};

export function useUpdateBankAccount(
  options?: UseMutationOptions<void, Error, UpdateBankAccountValues>,
): UseMutationResult<void, Error, UpdateBankAccountValues> {
  const fetcher = useApiFetcher();

  return useMutation({
    ...options,
    mutationFn: ({ bankAccountId }: UpdateBankAccountValues) =>
      refreshBankAccount(fetcher, bankAccountId),
  });
}
