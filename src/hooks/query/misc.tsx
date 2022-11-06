// @ts-nocheck
import { useRequestQuery } from '../useQueryRequest';

/**
 * Retrieve the job metadata.
 */
export function useDateFormats(props = {}) {
  return useRequestQuery(
    ['DATE_FORMATS'],
    { method: 'get', url: `/date_formats` },
    {
      select: (res) => res.data.data,
      defaultData: [],
      ...props,
    },
  );
}
