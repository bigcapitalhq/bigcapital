import {
  claimSimpleFinToken,
  deleteSimpleFinItem,
  linkSimpleFinAccounts,
} from '@bigcapital/sdk-ts';
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useApiFetcher } from '../../../useRequest';
import { accountsKeys } from '../../accounts/query-keys';
import { cashflowAccountsKeys } from '../../cashflow-accounts/query-keys';
import type {
  SimpleFinClaimTokenBody,
  SimpleFinClaimTokenResponse,
  SimpleFinLinkAccountsBody,
  SimpleFinLinkAccountsResponse,
} from '@bigcapital/sdk-ts';

/**
 * Claims a SimpleFIN setup token and lists the accounts available to link.
 */
export function useSimpleFinClaimToken(
  props?: UseMutationOptions<
    SimpleFinClaimTokenResponse,
    Error,
    SimpleFinClaimTokenBody
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useMutation({
    ...props,
    mutationFn: (body: SimpleFinClaimTokenBody) =>
      claimSimpleFinToken(fetcher, body),
  });
}

/**
 * Links the selected SimpleFIN accounts as bank/credit card accounts.
 */
export function useSimpleFinLinkAccounts(
  props?: UseMutationOptions<
    SimpleFinLinkAccountsResponse,
    Error,
    SimpleFinLinkAccountsBody
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  const queryClient = useQueryClient();

  return useMutation({
    ...props,
    mutationFn: (body: SimpleFinLinkAccountsBody) =>
      linkSimpleFinAccounts(fetcher, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cashflowAccountsKeys.all() });
      queryClient.invalidateQueries({ queryKey: accountsKeys.all() });
    },
  });
}

/**
 * Removes a claimed SimpleFIN connection that has no linked accounts.
 */
export function useSimpleFinDeleteItem(
  props?: UseMutationOptions<void, Error, string>,
) {
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (itemId: string) => deleteSimpleFinItem(fetcher, itemId),
  });
}
