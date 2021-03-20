import { useMutation, useQueryClient } from 'react-query';
import { batch } from 'react-redux';
import t from './types';
import useApiRequest from '../useRequest';
import { useRequestQuery } from '../useQueryRequest';
import { useSetOrganizations, useSetSubscriptions } from '../state';
import { omit } from 'lodash';

/**
 * Retrieve organizations of the authenticated user.
 */
export function useOrganizations(props) {
  return useRequestQuery(
    [t.ORGANIZATIONS],
    { method: 'get', url: `organization/all` },
    {
      select: (res) => res.data.organizations,
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
 * Retrieve the current organization metadata.
 */
export function useCurrentOrganization(props) {
  const setOrganizations = useSetOrganizations();
  const setSubscriptions = useSetSubscriptions();

  return useRequestQuery(
    [t.ORGANIZATION_CURRENT],
    { method: 'get', url: `organization/current` },
    {
      select: (res) => res.data.organization,
      defaultData: {},
      onSuccess: (data) => {
        const organization = omit(data, ['subscriptions']);

        batch(() => {
          // Sets subscriptions.
          setSubscriptions(data.subscriptions);

          // Sets organizations.
          setOrganizations([organization]);
        });
      },
      ...props,
    },
  );
}

/**
 * Builds the current tenant.
 */
export function useBuildTenant(props) {
  const apiRequest = useApiRequest();
  const queryClient = useQueryClient();

  return useMutation((values) => apiRequest.post('organization/build'), {
    onSuccess: (res, values) => {
      queryClient.invalidateQueries(t.ORGANIZATION_CURRENT);
      queryClient.invalidateQueries(t.ORGANIZATIONS);
    },
    ...props,
  });
}

/**
 * Seeds the current tenant
 */
export function useSeedTenant() {
  const apiRequest = useApiRequest();
  const queryClient = useQueryClient();

  return useMutation((values) => apiRequest.post('organization/seed'), {
    onSuccess: (res) => {
      queryClient.invalidateQueries(t.ORGANIZATION_CURRENT);
      queryClient.invalidateQueries(t.ORGANIZATIONS);
    },
  });
}

/**
 * Organization setup.
 */
export function useOrganizationSetup() {
  const apiRequest = useApiRequest();
  const queryClient = useQueryClient();

  return useMutation(
    (values) => apiRequest.post(`setup/organization`, values),
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries(t.ORGANIZATION_CURRENT);
        queryClient.invalidateQueries(t.ORGANIZATIONS);
      },
    },
  );
}
