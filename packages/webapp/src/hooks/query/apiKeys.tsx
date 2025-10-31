// @ts-nocheck
import { useMutation, useQueryClient } from 'react-query';
import { useRequestQuery } from '../useQueryRequest';
import useApiRequest from '../useRequest';
import t from './types';

const commonInvalidateQueries = (query) => {
  query.invalidateQueries(t.API_KEYS);
};

/**
 * Retrieve API keys list.
 */
export function useApiKeys(props) {
  return useRequestQuery(
    [t.API_KEYS],
    { method: 'get', url: 'api-keys' },
    {
      select: (res) => res.data || [],
      defaultData: [],
      ...props,
    },
  );
}

/**
 * Generates a new API key.
 */
export function useGenerateApiKey(props) {
  const client = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((values) => apiRequest.post('api-keys/generate', values), {
    onSuccess: () => {
      commonInvalidateQueries(client);
    },
    ...props,
  });
}

/**
 * Revokes the given API key.
 */
export function useRevokeApiKey(props) {
  const client = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (id) => apiRequest.put(`api-keys/${id}/revoke`),
    {
      onSuccess: () => {
        commonInvalidateQueries(client);
      },
      ...props,
    },
  );
}
