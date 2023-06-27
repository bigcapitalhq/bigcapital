// @ts-nocheck
import { useQuery } from 'react-query';
import { castArray, defaultTo } from 'lodash';
import { useAuthOrganizationId } from './state';
import useApiRequest from './useRequest';
import { useRef } from 'react';

/**
 * Query for tenant requests.
 */
export function useQueryTenant(query, callback, props) {
  const organizationId = useAuthOrganizationId();

  return useQuery([...castArray(query), organizationId], callback, props);
}

export function useRequestQuery(query, axios, props) {
  const apiRequest = useApiRequest();

  const states = useQuery(
    query,
    () => apiRequest.http({ ...axios, url: `/api/${axios.url}` }),
    props,
  );
  // Memorize the default data.
  const defaultData = useRef(props.defaultData || undefined);

  return {
    ...states,
    data: defaultTo(states.data, defaultData.current),
  };
}
