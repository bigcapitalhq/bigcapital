import { useQuery } from '@tanstack/react-query';
import { castArray } from 'lodash';
import { useAuthOrganizationId } from './state';
import type { QueryFunction, QueryKey } from '@tanstack/react-query';

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
