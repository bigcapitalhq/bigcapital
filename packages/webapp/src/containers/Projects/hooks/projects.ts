// @ts-nocheck
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { queryTypes as t } from './type';
import { useRequestQuery } from '@/hooks/useQueryRequest';
import useApiRequest from '@/hooks/useRequest';

// Common invalidate queries.
const commonInvalidateQueries = (queryClient) => {
  // Invalidate projects.
  queryClient.invalidateQueries({ queryKey: [t.PROJECT] });
  queryClient.invalidateQueries({ queryKey: [t.PROJECTS] });
};

export function useCreateProject(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation({
    mutationFn: (values) => apiRequest.post('projects', values),
    onSuccess: (res, values) => {
      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

export function useEditProject(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation({
    mutationFn: ([id, values]) => apiRequest.put(`/projects/${id}`, values),
    onSuccess: (res, [id, values]) => {
      // Invalidate specific project.
      queryClient.invalidateQueries({ queryKey: [t.PROJECT, id] });

      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

export function useDeleteProject(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation({
    mutationFn: (id) => apiRequest.delete(`projects/${id}`),
    onSuccess: (res, id) => {
      // Invalidate specific project.
      queryClient.invalidateQueries({ queryKey: [t.PROJECT, id] });

      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

export function useProject(projectId, props, requestProps) {
  return useRequestQuery(
    [t.PROJECT, projectId],
    { method: 'get', url: `projects/${projectId}`, ...requestProps },
    props,
  );
}

const transformProjects = (res) => ({
  projects: res.data.projects,
});

export function useProjects(query, props) {
  return useRequestQuery(
    [t.PROJECTS, query],
    { method: 'get', url: 'projects', params: query },
    props,
  );
}

export function useProjectStatus(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation({
    mutationFn: ([id, values]) =>
      apiRequest.patch(`projects/${id}/status`, values),
    onSuccess: (res, [id, values]) => {
      // Invalidate specific project.
      queryClient.invalidateQueries({ queryKey: [t.PROJECT, id] });

      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

export function useRefreshProjects() {
  const queryClient = useQueryClient();

  return {
    refresh: () => {
      queryClient.invalidateQueries({ queryKey: [t.PROJECTS] });
    },
  };
}
