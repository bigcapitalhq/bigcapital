import { useMutation, useQueryClient } from 'react-query';
import { useRequestQuery } from '@/hooks/useQueryRequest';
import useApiRequest from '@/hooks/useRequest';
import { useAuthOrganizationId } from '@/hooks/state';
import { transformToCamelCase } from '@/utils';

/** POST /workspaces body (snake_case keys). */
export interface CreateWorkspaceRequest {
  name: string;
  location: string;
  base_currency: string;
  language: string;
  fiscal_year: string;
  timezone: string;
}

export interface CreateWorkspaceResponse {
  organizationId: string;
  jobId: string;
}

/**
 * Retrieve workspaces of the authenticated user.
 * @param options.includeInactive - Whether to include inactive workspaces (default: false)
 */
export function useWorkspaces(options: Record<string, unknown> = {}) {
  const { includeInactive = false, ...props } = options;
  const currentOrganizationId = useAuthOrganizationId();

  return useRequestQuery(
    ['workspaces', { includeInactive }],
    { method: 'get', url: 'workspaces', params: { includeInactive, currentOrganizationId } },
    {
      select: (res: { data: unknown }) => transformToCamelCase(res.data),
      initialDataUpdatedAt: 0,
      initialData: [],
      ...props,
    },
  );
}

/**
 * Creates a new workspace.
 */
export function useCreateWorkspace() {
  const apiRequest = useApiRequest();
  const queryClient = useQueryClient();

  return useMutation<
    CreateWorkspaceResponse,
    unknown,
    CreateWorkspaceRequest
  >({
    mutationFn: async (values) => {
      const response = await apiRequest.post('workspaces', values, undefined);
      return transformToCamelCase(response.data) as CreateWorkspaceResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['workspaces']);
    },
  });
}

/**
 * Sets the default workspace for the authenticated user.
 */
export function useSetDefaultWorkspace() {
  const apiRequest = useApiRequest();
  const queryClient = useQueryClient();

  return useMutation(
    async (values: { organizationId: string }) => {
      const response = await apiRequest.put('workspaces/default', values);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['workspaces']);
      },
    },
  );
}

/**
 * Deletes a workspace (owner only).
 */
export function useDeleteWorkspace(props?: Record<string, unknown>) {
  const apiRequest = useApiRequest();
  const queryClient = useQueryClient();

  return useMutation(
    async (organizationId: string) => {
      const response = await apiRequest.delete(
        `workspaces/${organizationId}`,
        undefined,
      );
      return transformToCamelCase(response.data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['workspaces']);
      },
      ...props,
    },
  );
}

/**
 * Inactivates a workspace (owner only).
 */
export function useInactivateWorkspace(props?: Record<string, unknown>) {
  const apiRequest = useApiRequest();
  const queryClient = useQueryClient();

  return useMutation(
    async (organizationId: string) => {
      const response = await apiRequest.put(
        `workspaces/${organizationId}/inactivate`,
        undefined,
      );
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['workspaces']);
      },
      ...props,
    },
  );
}

/**
 * Activates (reactivates) a workspace (owner only).
 */
export function useActivateWorkspace(props?: Record<string, unknown>) {
  const apiRequest = useApiRequest();
  const queryClient = useQueryClient();

  return useMutation(
    async (organizationId: string) => {
      const response = await apiRequest.put(
        `workspaces/${organizationId}/activate`,
        undefined,
      );
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['workspaces']);
      },
      ...props,
    },
  );
}
