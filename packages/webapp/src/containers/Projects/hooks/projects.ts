// @ts-nocheck
import { useQueryClient, useMutation } from 'react-query';
import { useRequestQuery } from '@/hooks/useQueryRequest';
import { transformPagination } from '@/utils';
import useApiRequest from '@/hooks/useRequest';
import t from './type';

// Common invalidate queries.
const commonInvalidateQueries = (queryClient) => {
  // Invalidate projects.
  queryClient.invalidateQueries(t.PROJECT);
  queryClient.invalidateQueries(t.PROJECTS);
};

/**
 * Create a new project
 * @param props
 */
export function useCreateProject(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((values) => apiRequest.post('projects', values), {
    onSuccess: (res, values) => {
      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Edit the given project
 * @param props
 * @returns
 */
export function useEditProject(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) => apiRequest.post(`/projects/${id}`, values),
    {
      onSuccess: (res, [id, values]) => {
        // Invalidate specific project.
        queryClient.invalidateQueries([t.PROJECT, id]);

        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

/**
 * Delete the given project
 * @param props
 */
export function useDeleteProject(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.delete(`projects/${id}`), {
    onSuccess: (res, id) => {
      // Invalidate specific project.
      queryClient.invalidateQueries([t.PROJECT, id]);

      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Retrieve the projects details.
 * @param projectId The project id
 * @param props
 * @param requestProps
 * @returns
 */
export function useProject(projectId, props, requestProps) {
  return useRequestQuery(
    [t.PROJECT, projectId],
    { method: 'get', url: `projects/${projectId}`, ...requestProps },
    {
      select: (res) => res.data.project,
      defaultData: {},
      ...props,
    },
  );
}

const transformProjects = (res) => ({
  projects: res.data.projects,
});

/**
 * Retrieve projects list with pagination meta.
 * @param query
 * @param props
 */
export function useProjects(query, props) {
  return useRequestQuery(
    [t.PROJECTS, query],
    { method: 'get', url: 'projects', params: query },
    {
      select: transformProjects,
      defaultData: {
        projects: [],
      },
      ...props,
    },
  );
}

/**
 *
 * @param props
 * @returns
 */
export function useProjectStatus(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) => apiRequest.patch(`projects/${id}/status`, values),
    {
      onSuccess: (res, [id, values]) => {
        // Invalidate specific project.
        queryClient.invalidateQueries([t.PROJECT, id]);

        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

export function useRefreshProjects() {
  const queryClient = useQueryClient();

  return {
    refresh: () => {
      queryClient.invalidateQueries(t.PROJECTS);
    },
  };
}
