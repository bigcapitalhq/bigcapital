import t from 'store/types';
import useApiRequest from '../useRequest';
import { useQueryTenant } from '../useQueryTenant';

/**
 * Retrieve the contact duplicate.
 */
export function useOrganizations(props) {
  const apiRequest = useApiRequest();

  return useQueryTenant(
    [t.ORGANIZATIONS],
    () => apiRequest.get(`organization/all`),
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
