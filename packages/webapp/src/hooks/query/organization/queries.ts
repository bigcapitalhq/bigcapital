import {
  fetchOrganizationCurrent,
  buildOrganization,
  updateOrganization,
  fetchOrgBaseCurrencyMutateAbilities,
} from '@bigcapital/sdk-ts';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useRequestQuery } from '../../useQueryRequest';
import { useApiFetcher } from '../../useRequest';
import { organizationKeys } from './query-keys';
import type {
  OrganizationCurrent,
  UpdateOrganizationBody,
  BuildOrganizationBody,
  OrgBaseCurrencyMutateAbilitiesResponse,
} from '@bigcapital/sdk-ts';

/**
 * Retrieve organizations of the authenticated user.
 * Uses useRequestQuery because organization/all is not in OpenAPI schema.
 */
export function useOrganizations(props?: Record<string, unknown>) {
  return useRequestQuery(
    organizationKeys.all(),
    { method: 'get', url: `organization/all` },
    {
      select: (res: { data: { organizations: unknown[] } }) =>
        res.data.organizations,
      initialDataUpdatedAt: 0,
      initialData: {
        data: {
          organizations: [],
        },
      },
      ...props,
    },
  );
}

/**
 * Retrieve the current organization. Response keys are transformed to camelCase
 * to match the SDK types (the API serializes to snake_case).
 */
export function useCurrentOrganization(
  props?: Omit<UseQueryOptions<OrganizationCurrent>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...props,
    queryKey: organizationKeys.current(),
    queryFn: () => fetchOrganizationCurrent(fetcher),
  });
}

/**
 * The current organization's metadata object.
 */
export function useCurrentOrganizationMetadata() {
  const { data } = useCurrentOrganization();
  return data?.metadata;
}

/**
 * The current organization's base currency code (e.g. "USD").
 */
export function useCurrentOrganizationBaseCurrency() {
  return useCurrentOrganizationMetadata()?.baseCurrency;
}

/**
 * The current organization's display name (empty string while loading).
 */
export function useCurrentOrganizationName() {
  return useCurrentOrganizationMetadata()?.name ?? '';
}

/**
 * Organization setup.
 */
export function useOrganizationSetup(
  props?: UseMutationOptions<void, Error, BuildOrganizationBody>,
) {
  const fetcher = useApiFetcher();
  const queryClient = useQueryClient();

  return useMutation({
    ...props,
    mutationFn: (values: BuildOrganizationBody) =>
      buildOrganization(fetcher, values) as Promise<void>,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.current() });
      queryClient.invalidateQueries({ queryKey: organizationKeys.all() });
      props?.onSuccess?.(...args);
    },
  });
}

/**
 * Saves the organization.
 */
export function useUpdateOrganization(
  props?: UseMutationOptions<void, Error, UpdateOrganizationBody>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (information: UpdateOrganizationBody) =>
      updateOrganization(fetcher, information),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.current() });
      queryClient.invalidateQueries({ queryKey: organizationKeys.all() });
      props?.onSuccess?.(...args);
    },
  });
}

export function useOrgBaseCurrencyMutateAbilities(
  props?: Omit<
    UseQueryOptions<OrgBaseCurrencyMutateAbilitiesResponse>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher();

  return useQuery({
    ...props,
    queryKey: organizationKeys.mutateAbilities(),
    queryFn: () => fetchOrgBaseCurrencyMutateAbilities(fetcher),
    select: (data: OrgBaseCurrencyMutateAbilitiesResponse) =>
      data?.abilities ?? [],
  });
}
