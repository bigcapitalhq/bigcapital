import { fetchOrganizationBuildJob } from '@bigcapital/sdk-ts';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';
import { jobsKeys } from './query-keys';
import type { OrganizationBuildJob } from '@bigcapital/sdk-ts';

/**
 * Retrieve the job metadata.
 */
export function useJob(
  jobId: string | number | null | undefined,
  props: Omit<
    UseQueryOptions<OrganizationBuildJob>,
    'queryKey' | 'queryFn'
  > = {},
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: jobsKeys.detail(jobId),
    queryFn: () => fetchOrganizationBuildJob(fetcher, jobId as number),
    enabled: jobId != null,
  });
}
