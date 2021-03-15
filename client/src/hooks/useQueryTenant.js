import { useQuery } from 'react-query';
import { castArray } from 'lodash';
import { useAuthOrganizationId } from './state';

/**
 * Query for tenant requests.
 */
 export function useQueryTenant(query, callback, props) {
  const organizationId  = useAuthOrganizationId();

  return useQuery([...castArray(query), organizationId], callback, props);
}
