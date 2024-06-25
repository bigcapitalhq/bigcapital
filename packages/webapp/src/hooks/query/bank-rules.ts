// @ts-nocheck
import { useMutation, useQuery, useQueryClient } from 'react-query';
import useApiRequest from '../useRequest';

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

  return useMutation((id: number) => apiRequest.post(`/bank-rules/${id}`), {
    onSuccess: (res, id) => {
      // Invalidate queries.
    },
    ...props,
  });
}

export function useDeleteBankRule(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id: number) => apiRequest.delete(`/bank-rules/${id}`), {
    onSuccess: (res, id) => {
      // Invalidate queries.
    },
    ...props,
  });
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
