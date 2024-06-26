// @ts-nocheck
import { useMutation, useQuery, useQueryClient } from 'react-query';
import useApiRequest from '../useRequest';
import { transformToCamelCase } from '@/utils';

/**
 *
 */
export function useCreateBankRule(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((values) => apiRequest.post(`/banking/rules`, values), {
    onSuccess: (res, id) => {
      // Invalidate queries.
    },
    ...props,
  });
}

export function useEditBankRule(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) => apiRequest.post(`/banking/rules/${id}`, values),
    {
      onSuccess: (res, id) => {
        // Invalidate queries.
      },
      ...props,
    },
  );
}

export function useDeleteBankRule(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (id: number) => apiRequest.delete(`/banking/rules/${id}`),
    {
      onSuccess: (res, id) => {
        // Invalidate queries.
      },
      ...props,
    },
  );
}

/**
 *
 * @returns
 */
export function useBankRules() {
  const apiRequest = useApiRequest();

  return useQuery(['BANK_RULEs'], () =>
    apiRequest.get('/banking/rules').then((res) => res.data.bank_rules),
  );
}

/**
 *
 * @returns
 */
export function useBankRule(bankRuleId: number, props) {
  const apiRequest = useApiRequest();

  return useQuery(
    ['BANK_RULEs', bankRuleId],
    () =>
      apiRequest
        .get(`/banking/rules/${bankRuleId}`)
        .then((res) => res.data.bank_rule),
    props,
  );
}

/**
 *
 * @returns
 */
export function useMatchingTransactions(props?: any) {
  const apiRequest = useApiRequest();

  return useQuery(
    ['MATCHING_TRANSACTION'],
    () =>
      apiRequest
        .get(`/banking/matches`)
        .then((res) => transformToCamelCase(res.data.data)),
    props,
  );
}

export function useExcludeUncategorizedTransaction(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (uncategorizedTransactionId: number) =>
      apiRequest.put(
        `/cashflow/transactions/${uncategorizedTransactionId}/exclude`,
      ),
    {
      onSuccess: (res, id) => {
        // Invalidate queries.
      },
      ...props,
    },
  );
}

export function useUnexcludeUncategorizedTransaction(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (uncategorizedTransactionId: number) =>
      apiRequest.post(
        `/cashflow/transactions/${uncategorizedTransactionId}/unexclude`,
      ),
    {
      onSuccess: (res, id) => {
        // Invalidate queries.
      },
      ...props,
    },
  );
}

export function useMatchTransaction(props?: any) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([uncategorizedTransactionId, values]) =>
      apiRequest.post(`/banking/matches/${uncategorizedTransactionId}`, values),
    {
      onSuccess: (res, id) => {
        // Invalidate queries.
      },
      ...props,
    },
  );
}
