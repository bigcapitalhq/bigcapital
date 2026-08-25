import { useQuery } from '@tanstack/react-query';
import { castArray, defaultTo } from 'lodash';
import { useRef } from 'react';
import { normalizeApiPath } from '../utils';
import { useAuthOrganizationId } from './state';
import useApiRequest from './useRequest';
import type { QueryFunction, QueryKey } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';

/**
 * Query for tenant requests.
 */
export function useQueryTenant<TData = unknown>(
  query: QueryKey | unknown,
  callback: QueryFunction<TData>,
  props?: Record<string, unknown>,
) {
  const organizationId = useAuthOrganizationId();

  return useQuery({
    queryKey: [...castArray(query), organizationId],
    queryFn: callback,
    ...(props as object),
  } as any);
}

export function useRequestQuery<TData = any>(
  query: QueryKey | unknown,
  axios: { url: string } & AxiosRequestConfig,
  props?: { defaultData?: unknown } & Record<string, unknown>,
) {
  const apiRequest = useApiRequest();
  const { defaultData: defaultDataProp, ...restProps } = props || {};

  const states = useQuery({
    queryKey: castArray(query) as QueryKey,
    queryFn: () =>
      apiRequest.http({
        ...axios,
        url: `/api/${normalizeApiPath(axios.url)}`,
      }) as Promise<TData>,
    placeholderData: defaultDataProp,
    ...(restProps as object),
  } as any);
  const defaultData = useRef(defaultDataProp ?? undefined);

  return {
    ...states,
    data: defaultTo(states.data, defaultData.current) as TData | undefined,
  };
}
