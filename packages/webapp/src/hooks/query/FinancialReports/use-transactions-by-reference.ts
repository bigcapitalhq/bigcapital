import { fetchTransactionsByReferenceJson } from '@bigcapital/sdk-ts';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';
import { financialReportsKeys } from './query-keys';
import type {
  TransactionsByReferenceJsonQuery,
  TransactionsByReferenceJsonResponse,
} from '@bigcapital/sdk-ts';

export function useTransactionsByReference(
  query: TransactionsByReferenceJsonQuery,
  props?: Omit<
    UseQueryOptions<TransactionsByReferenceJsonResponse, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher();
  return useQuery({
    ...props,
    queryKey: financialReportsKeys.transactionsByReference(query),
    queryFn: () => fetchTransactionsByReferenceJson(fetcher, query),
  });
}
