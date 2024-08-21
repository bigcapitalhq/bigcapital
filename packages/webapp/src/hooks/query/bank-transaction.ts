// @ts-nocheck
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import useApiRequest from '../useRequest';
import { BANK_QUERY_KEY } from '@/constants/query-keys/banking';

interface GetBankRuleRes {}

/**
 * Retrieve the given bank rule.
 * @param {number} bankRuleId -
 * @param {UseQueryOptions<GetBankRuleRes, Error>} options -
 * @returns {UseQueryResult<GetBankRuleRes, Error>}
 */
export function usePendingBankAccountTransactions(
  bankRuleId: number,
  options?: UseQueryOptions<GetBankRuleRes, Error>,
): UseQueryResult<GetBankRuleRes, Error> {
  const apiRequest = useApiRequest();

  return useQuery<GetBankRuleRes, Error>(
    [BANK_QUERY_KEY.PENDING_BANK_ACCOUNT_TRANSACTIONS],
    () =>
      apiRequest
        .get(`/banking/bank_account/pending_transactions`)
        .then((res) => res.data),
    { ...options },
  );
}
