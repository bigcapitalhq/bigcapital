import { fetchApiKeys, generateApiKey, revokeApiKey } from '@bigcapital/sdk-ts';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';
import { apiKeysKeys } from './query-keys';
import type { ApiKeysList, GenerateApiKeyBody } from '@bigcapital/sdk-ts';

const commonInvalidateQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  queryClient.invalidateQueries({ queryKey: apiKeysKeys.all() });
};

export function useApiKeys(
  props?: Omit<UseQueryOptions<ApiKeysList>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher();
  return useQuery({
    ...props,
    queryKey: apiKeysKeys.list(),
    queryFn: () => fetchApiKeys(fetcher),
  });
}

export function useGenerateApiKey(
  props?: UseMutationOptions<void, Error, GenerateApiKeyBody>,
) {
  const client = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (values: GenerateApiKeyBody) => generateApiKey(fetcher, values),
    onSuccess: () => commonInvalidateQueries(client),
  });
}

export function useRevokeApiKey(
  props?: UseMutationOptions<void, Error, number>,
) {
  const client = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number) => revokeApiKey(fetcher, id),
    onSuccess: () => commonInvalidateQueries(client),
  });
}
