// @ts-nocheck
import { useQueryClient, useMutation } from 'react-query';
import useApiRequest from '../useRequest';
import { useRequestQuery } from '../useQueryRequest';

import t from './types';

const commonInvalidateQueries = (queryClient) => {
  // Invalidate bills.
  queryClient.invalidateQueries(t.BILLS);
  queryClient.invalidateQueries(t.BILL);
  // Invalidate landed cost.
  queryClient.invalidateQueries(t.LANDED_COST);
  queryClient.invalidateQueries(t.LANDED_COST_TRANSACTION);
};

/**
 * Creates a new landed cost.
 */
export function useCreateLandedCost(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) =>
      apiRequest.post(`purchases/landed-cost/bills/${id}/allocate`, values),
    {
      onSuccess: (res, id) => {
        // Common invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

/**
 * Deletes the given landed cost.
 */
export function useDeleteLandedCost(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (landedCostId) =>
      apiRequest.delete(`purchases/landed-cost/${landedCostId}`),
    {
      onSuccess: (res, id) => {
        // Common invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

/**
 * Retrieve the landed cost transactions.
 */
export function useLandedCostTransaction(query, props) {
  return useRequestQuery(
    [t.LANDED_COST, query],
    {
      method: 'get',
      url: 'purchases/landed-cost/transactions',
      params: { transaction_type: query },
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

/**
 * Retrieve the bill located landed cost transactions.
 */
export function useBillLocatedLandedCost(id, props) {
  return useRequestQuery(
    [t.LANDED_COST_TRANSACTION, id],
    { method: 'get', url: `purchases/landed-cost/bills/${id}/transactions` },
    {
      select: (res) => res.data.transactions,
      defaultData: {},
      ...props,
    },
  );
}
