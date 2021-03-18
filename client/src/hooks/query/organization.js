import { useMutation } from 'react-query';
import t from './types';
import useApiRequest from '../useRequest';
import { useRequestQuery } from '../useQueryRequest';
import { useEffect } from 'react';
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

  const query = useRequestQuery(
    [t.ORGANIZATION_CURRENT],
    { method: 'get', url: `organization/current` },
    {
      select: (res) => res.data.organization,
      defaultData: {},
      ...props,
    },
  );

  useEffect(() => {
    if (query.isSuccess) {
      const organization = omit(query.data, ['subscriptions']);

      // Sets organizations.
      setOrganizations([organization]);

      // Sets subscriptions.
      setSubscriptions(query.data.subscriptions);
    }
  }, [query.data, query.isSuccess, setOrganizations, setSubscriptions]);

  return query;
}

/**
 * Builds the current tenant.
 */
export function useBuildTenant(props) {
  const apiRequest = useApiRequest();

  return useMutation(
    (values) => apiRequest.post('organization/build'),
    {
      onSuccess: (res, values) => {
        
      },
      ...props,
    },
  );
};

/**
 * Seeds the current tenant
 */
export function useSeedTenant() {
  const apiRequest = useApiRequest();

  return useMutation(
    (values) => apiRequest.post('organization/seed'),
    {
      onSuccess: (res) => {
        
      },
    }
  )
};