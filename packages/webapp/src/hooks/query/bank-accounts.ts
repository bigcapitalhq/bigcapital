// @ts-nocheck
import {
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
  useMutation,
} from 'react-query';
import useApiRequest from '../useRequest';
import t from './types';

type PuaseFeedsBankAccountValues = { bankAccountId: number };

interface PuaseFeedsBankAccountResponse {}

/**
 * Resumes the feeds syncing of the bank account.
 * @param {UseMutationResult<PuaseFeedsBankAccountResponse, Error, ExcludeBankTransactionValue>} options
 * @returns {UseMutationResult<PuaseFeedsBankAccountResponse, Error, ExcludeBankTransactionValue>}
 */
export function usePauseFeedsBankAccount(
  options?: UseMutationOptions<
    PuaseFeedsBankAccountResponse,
    Error,
    PuaseFeedsBankAccountValues
  >,
): UseMutationResult<
  PuaseFeedsBankAccountResponse,
  Error,
  PuaseFeedsBankAccountValues
> {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation<
    PuaseFeedsBankAccountResponse,
    Error,
    PuaseFeedsBankAccountValues
  >(
    (values) =>
      apiRequest.post(
        `/banking/bank_accounts/${values.bankAccountId}/pause_feeds`,
      ),
    {
      onSuccess: (res, values) => {
        queryClient.invalidateQueries([t.ACCOUNT, values.bankAccountId]);
      },
      ...options,
    },
  );
}

type ResumeFeedsBankAccountValues = { bankAccountId: number };

interface ResumeFeedsBankAccountResponse {}

/**
 * Resumes the feeds syncing of the bank account.
 * @param {UseMutationResult<ResumeFeedsBankAccountResponse, Error, ResumeFeedsBankAccountValues>} options
 * @returns {UseMutationResult<ResumeFeedsBankAccountResponse, Error, ResumeFeedsBankAccountValues>}
 */
export function useResumeFeedsBankAccount(
  options?: UseMutationOptions<
    ResumeFeedsBankAccountResponse,
    Error,
    ResumeFeedsBankAccountValues
  >,
): UseMutationResult<
  ResumeFeedsBankAccountResponse,
  Error,
  ResumeFeedsBankAccountValues
> {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation<
    ResumeFeedsBankAccountResponse,
    Error,
    ResumeFeedsBankAccountValues
  >(
    (values) =>
      apiRequest.post(
        `/banking/bank_accounts/${values.bankAccountId}/resume_feeds`,
      ),
    {
      onSuccess: (res, values) => {
        queryClient.invalidateQueries([t.ACCOUNT, values.bankAccountId]);
      },
      ...options,
    },
  );
}
