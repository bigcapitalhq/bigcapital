// @ts-nocheck

import { useRequestQuery } from '@/hooks/useQueryRequest';
import t from './type';

/**
 *
 * @param projectId - Project id.
 * @param query
 * @param props
 * @returns
 */
export function useProjectBillableEntries(projectId, query, props) {
  return useRequestQuery(
    [t.PROJECT_BILLABLE_ENTRIES, projectId, query],
    {
      method: 'get',
      url: `projects/${projectId}/billable/entries`,
      params: query,
    },
    {
      select: (res) => res.data.billable_entries,
      defaultData: {},
      ...props,
    },
  );
}
