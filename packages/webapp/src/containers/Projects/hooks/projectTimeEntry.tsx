// @ts-nocheck
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { queryTypes as t } from './type';
import { useRequestQuery } from '@/hooks/useQueryRequest';
import useApiRequest from '@/hooks/useRequest';

// Common invalidate queries.
const commonInvalidateQueries = (queryClient) => {
  // Invalidate projects.
  queryClient.invalidateQueries({ queryKey: [t.PROJECTS] });
  // Invalidate project entries.
  queryClient.invalidateQueries({ queryKey: [t.PROJECT_TIME_ENTRIES] });
};

export function useCreateProjectTimeEntry(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation({
    mutationFn: ([id, values]) =>
      apiRequest.post(`/projects/tasks/${id}/times`, values),
    onSuccess: () => {
      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

export function useEditProjectTimeEntry(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation({
    mutationFn: ([id, values]) =>
      apiRequest.put(`projects/times/${id}`, values),
    onSuccess: (res, [id, values]) => {
      // Invalidate specific project time entry.
      queryClient.invalidateQueries({ queryKey: [t.PROJECT_TIME_ENTRY, id] });

      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

export function useDeleteProjectTimeEntry(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation({
    mutationFn: (id) => apiRequest.delete(`projects/times/${id}`),
    onSuccess: (res, id) => {
      // Invalidate specific project task.
      queryClient.invalidateQueries({ queryKey: [t.PROJECT_TASK, id] });

      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

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
