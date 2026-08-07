import {
  acceptInvite,
  bulkSendInviteUsers,
  fetchInviteCheck,
  resendInvite,
} from '@bigcapital/sdk-ts';
import {
  useMutation,
  useQuery,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';
import { inviteKeys } from './query-keys';
import type { AcceptInviteBody, BulkInviteBody } from '@bigcapital/sdk-ts';

export function useAuthInviteAccept(
  props?: UseMutationOptions<unknown, Error, [Record<string, unknown>, string]>,
) {
  const fetcher = useApiFetcher();
  return useMutation({
    ...props,
    mutationFn: ([values, token]: [Record<string, unknown>, string]) =>
      acceptInvite(fetcher, token, values as AcceptInviteBody),
  });
}

export function useInviteMetaByToken(
  token: string | null | undefined,
  props?: Omit<UseQueryOptions<unknown>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: inviteKeys.meta(token),
    queryFn: () => fetchInviteCheck(fetcher, token!),
    enabled: !!token,
  });
}

export function useResendInvitation(
  props?: UseMutationOptions<void, Error, number>,
) {
  const fetcher = useApiFetcher();
  return useMutation({
    ...props,
    mutationFn: (userId: number) => resendInvite(fetcher, userId),
  });
}

export function useBulkCreateInviteUsers(
  props?: UseMutationOptions<unknown, Error, BulkInviteBody>,
) {
  const fetcher = useApiFetcher();
  return useMutation({
    ...props,
    mutationFn: (body: BulkInviteBody) => bulkSendInviteUsers(fetcher, body),
  });
}
