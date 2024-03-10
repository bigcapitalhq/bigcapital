// @ts-nocheck
import { useRequestQuery } from '../../useQueryRequest';
import t from '../types';
/**
 * Retrieve transactions by reference report.
 */
export function useTransactionsByReference(query, props) {
  return useRequestQuery(
    [t.TRANSACTIONS_BY_REFERENCE, query],
    {
      method: 'get',
      url: `/financial_statements/transactions-by-reference`,
      params: query,
    },
    {
      select: (res) => res.data,
      defaultData: {
        transactions: [],
      },
      ...props,
    },
  );
}
