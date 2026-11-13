import {
  confirmTwoFactorSetup,
  disableTwoFactor,
  fetchOrganizationTwoFactor,
  fetchTwoFactorStatus,
  regenerateTwoFactorRecoveryCodes,
  startTwoFactorSetup,
  updateOrganizationTwoFactor,
} from '@bigcapital/sdk-ts';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';
import { organizationKeys } from '../organization/query-keys';
import { twoFactorKeys } from './query-keys';
import type {
  OrganizationTwoFactor,
  OrganizationTwoFactorBody,
  TwoFactorConfirmSetupBody,
  TwoFactorRecoveryCodesResponse,
  TwoFactorSetupResponse,
  TwoFactorStatus,
  TwoFactorVerifyBody,
} from '@bigcapital/sdk-ts';

/**
 * Two-factor status of the signed-in user (camelCase).
 */
export function useTwoFactorStatus(
  props?: Omit<UseQueryOptions<TwoFactorStatus>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...props,
    queryKey: twoFactorKeys.status(),
    queryFn: () => fetchTwoFactorStatus(fetcher),
  });
}

/**
 * Starts the setup: a new secret and its otpauth URI (camelCase).
 */
export function useStartTwoFactorSetup(
  props?: UseMutationOptions<TwoFactorSetupResponse, Error, void>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useMutation({
    ...props,
    mutationFn: () => startTwoFactorSetup(fetcher),
  });
}

/**
 * Confirms the setup with a code; returns the recovery codes (camelCase).
 */
export function useConfirmTwoFactorSetup(
  props?: UseMutationOptions<
    TwoFactorRecoveryCodesResponse,
    Error,
    TwoFactorConfirmSetupBody
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  const queryClient = useQueryClient();

  return useMutation({
    ...props,
    mutationFn: (values: TwoFactorConfirmSetupBody) =>
      confirmTwoFactorSetup(fetcher, values),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: twoFactorKeys.all() });
      props?.onSuccess?.(...args);
    },
  });
}

/**
 * Replaces the recovery codes (password and a code).
 */
export function useRegenerateTwoFactorRecoveryCodes(
  props?: UseMutationOptions<
    TwoFactorRecoveryCodesResponse,
    Error,
    TwoFactorVerifyBody
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  const queryClient = useQueryClient();

  return useMutation({
    ...props,
    mutationFn: (values: TwoFactorVerifyBody) =>
      regenerateTwoFactorRecoveryCodes(fetcher, values),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: twoFactorKeys.all() });
      props?.onSuccess?.(...args);
    },
  });
}

/**
 * Turns two-factor off (password and a code).
 */
export function useDisableTwoFactor(
  props?: UseMutationOptions<void, Error, TwoFactorVerifyBody>,
) {
  const fetcher = useApiFetcher();
  const queryClient = useQueryClient();

  return useMutation({
    ...props,
    mutationFn: (values: TwoFactorVerifyBody) =>
      disableTwoFactor(fetcher, values),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: twoFactorKeys.all() });
      props?.onSuccess?.(...args);
    },
  });
}

/**
 * Whether the organization requires two-factor for all users.
 */
export function useOrganizationTwoFactor(
  props?: Omit<UseQueryOptions<OrganizationTwoFactor>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...props,
    queryKey: twoFactorKeys.organization(),
    queryFn: () => fetchOrganizationTwoFactor(fetcher),
  });
}

/**
 * Turns the organization requirement on or off (administrators only).
 */
export function useUpdateOrganizationTwoFactor(
  props?: UseMutationOptions<
    OrganizationTwoFactor,
    Error,
    OrganizationTwoFactorBody
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  const queryClient = useQueryClient();

  return useMutation({
    ...props,
    mutationFn: (values: OrganizationTwoFactorBody) =>
      updateOrganizationTwoFactor(fetcher, values),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: twoFactorKeys.organization() });
      queryClient.invalidateQueries({ queryKey: organizationKeys.current() });
      props?.onSuccess?.(...args);
    },
  });
}
