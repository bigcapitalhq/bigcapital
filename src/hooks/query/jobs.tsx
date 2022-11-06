// @ts-nocheck
import { useRequestQuery } from '../useQueryRequest';

/**
 * Retrieve the job metadata.
 */
export function useJob(jobId, props = {}) {
  return useRequestQuery(
    ['JOB', jobId],
    { method: 'get', url: `jobs/${jobId}` },
    {
      select: (res) => res.data.job,
      defaultData: {},
      ...props,
    },
  );
}
