// @ts-nocheck
import { useQueryClient, useMutation } from 'react-query';
import { useRequestQuery } from '@/hooks/useQueryRequest';
import useApiRequest from '@/hooks/useRequest';
import t from './type';

// Common invalidate queries.
const commonInvalidateQueries = (queryClient) => {
  // Invalidate projects.
  queryClient.invalidateQueries(t.PROJECTS);
  // Invalidate project entries.
  queryClient.invalidateQueries(t.PROJECT_TIME_ENTRIES);
};

/**
 * Create a new project time entry.
 * @param props
 * @returns
 */
export function useCreateProjectTimeEntry(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) => apiRequest.post(`/projects/tasks/${id}/times`, values),
    {
      onSuccess: () => {
        // Common invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

/**
 * Edit the given project time entry.
 * @param props
 * @returns
 */
export function useEditProjectTimeEntry(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) => apiRequest.post(`projects/times/${id}`, values),
    {
      onSuccess: (res, [id, values]) => {
        // Invalidate specific project time entry.
        queryClient.invalidateQueries([t.PROJECT_TIME_ENTRY, id]);

        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

/**
 * Delete the given project time entry
 * @param props
 */
export function useDeleteProjectTimeEntry(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.delete(`projects/times/${id}`), {
    onSuccess: (res, id) => {
      // Invalidate specific project task.
      queryClient.invalidateQueries([t.PROJECT_TASK, id]);

      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Retrieve the given project time entry.
 * @param timeId
 * @param props
 * @param requestProps
 * @returns
 */
export function useProjectTimeEntry(timeId, props, requestProps) {
  return useRequestQuery(
    [t.PROJECT_TIME_ENTRY, timeId],
    { method: 'get', url: `projects/times/${timeId}`, ...requestProps },
    {
      select: (res) => res.data.time_entry,
      defaultData: {},
      ...props,
    },
  );
}

const transformProjectTimeEntries = (res) => ({
  projectTimeEntries: res.data.timeline,
});

/**
 *
 * @param taskId - Task id.
 * @param props
 * @param requestProps
 * @returns
 */
export function useProjectTimeEntries(id, props, requestProps) {
  return useRequestQuery(
    [t.PROJECT_TIME_ENTRIES, id],
    { method: 'get', url: `projects/${id}/times`, ...requestProps },
    {
      select: transformProjectTimeEntries,
      defaultData: {
        projectTimeEntries: [],
      },
      ...props,
    },
  );
}
