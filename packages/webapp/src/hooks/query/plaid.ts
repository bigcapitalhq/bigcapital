// @ts-nocheck
import { useMutation } from 'react-query';
import useApiRequest from '../useRequest';

/**
 * Retrieves the plaid link token.
 */
export function useGetPlaidLinkToken(props = {}) {
  const apiRequest = useApiRequest();

  return useMutation(
    () => apiRequest.post('banking/plaid/link-token', {}, {}),
    {
      ...props,
    },
  );
}

/**
 * Retrieves the plaid link token.
 */
export function usePlaidExchangeToken(props = {}) {
  const apiRequest = useApiRequest();

  return useMutation(
    (data) => apiRequest.post('banking/plaid/exchange-token', data, {}),
    {
      ...props,
    },
  );
}
