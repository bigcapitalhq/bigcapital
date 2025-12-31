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
  // Normalize URL: remove leading slash and avoid double /api/ prefix
  let normalizedUrl = axios.url.replace(/^\//, '');
  const fullUrl = normalizedUrl.startsWith('api/')
    ? `/${normalizedUrl}`
    : `/api/${normalizedUrl}`;

  const states = useQuery(
    query,
    () => apiRequest.http({ ...axios, url: fullUrl }),
    props,
  );
  // Momerize the default data.
  const defaultData = useRef(props.defaultData || undefined);

  return {
    ...states,
    data: defaultTo(states.data, defaultData.current),
  };
}
