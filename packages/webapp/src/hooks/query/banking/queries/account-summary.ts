import {
  fetchAutofillCategorizeTransaction,
  fetchBankingAccountSummary,
} from '@bigcapital/sdk-ts';
import {
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { useApiFetcher } from '../../../useRequest';
import { bankingKeys } from '../query-keys';
import type {
  AutofillCategorizeTransactionResponse,
  BankingAccountSummaryResponse,
} from '@bigcapital/sdk-ts';

/** @deprecated Use AutofillCategorizeTransactionResponse from @bigcapital/sdk-ts */
export type GetAutofillCategorizeTransaction =
  AutofillCategorizeTransactionResponse;

export function useGetBankAccountSummaryMeta(
  bankAccountId: number,
  options?: UseQueryOptions<BankingAccountSummaryResponse, Error>,
): UseQueryResult<BankingAccountSummaryResponse, Error> {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...options,
    queryKey: bankingKeys.summaryMeta(bankAccountId),
    queryFn: () => fetchBankingAccountSummary(fetcher, bankAccountId),
  });
}

export function useGetAutofillCategorizeTransaction(
  uncategorizedTransactionIds: number[],
  options?: UseQueryOptions<AutofillCategorizeTransactionResponse, Error>,
): UseQueryResult<AutofillCategorizeTransactionResponse, Error> {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...options,
    queryKey: bankingKeys.autofillCategorize(uncategorizedTransactionIds),
    queryFn: () =>
      fetchAutofillCategorizeTransaction(fetcher, uncategorizedTransactionIds),
  });
}
