// @ts-nocheck
import { transformToCamelCase } from '@/utils';
import { useRequestQuery } from '../useQueryRequest';

/**
 * Retrieve the job metadata.
 */
export function useJob(jobId, props = {}) {
  return useRequestQuery(
    ['JOB', jobId],
    { method: 'get', url: `organization/build/${jobId}` },
    {
      select: (res) => transformToCamelCase(res.data),
      defaultData: {},
      ...props,
    },
  );
}
