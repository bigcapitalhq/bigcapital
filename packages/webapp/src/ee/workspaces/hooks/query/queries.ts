import {
  fetchWorkspaces,
  createWorkspace,
  deleteWorkspace,
  setDefaultWorkspace,
  inactivateWorkspace,
  activateWorkspace,
} from '@bigcapital/sdk-ts';
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { workspacesKeys } from './query-keys';
import type {
  Workspace,
  WorkspacesListResponse,
  CreateWorkspaceBody,
  CreateWorkspaceResponse,
  SetDefaultWorkspaceBody,
} from '@bigcapital/sdk-ts';
import { useAuthOrganizationId } from '@/hooks/state';
import { useApiFetcher } from '@/hooks/useRequest';

const commonInvalidateQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  queryClient.invalidateQueries({ queryKey: workspacesKeys.all() });
};

/**
 * Retrieve workspaces of the authenticated user.
 * @param options.includeInactive - Whether to include inactive workspaces (default: false)
 */
export function useWorkspaces(
  options: { includeInactive?: boolean } & Omit<
    UseQueryOptions<Workspace[]>,
    'queryKey' | 'queryFn'
  > = {},
) {
  const { includeInactive = false, ...props } = options;
  const currentOrganizationId = useAuthOrganizationId();
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery<Workspace[]>({
    ...props,
    queryKey: workspacesKeys.list({ includeInactive }),
    queryFn: () =>
      fetchWorkspaces(fetcher, {
        includeInactive: String(includeInactive),
        currentOrganizationId: currentOrganizationId ?? '',
      }),
    initialDataUpdatedAt: 0,
    initialData: [],
  });
}

/**
 * Creates a new workspace.
 */
export function useCreateWorkspace(
  props?: UseMutationOptions<
    CreateWorkspaceResponse,
    Error,
    CreateWorkspaceBody
  >,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (values: CreateWorkspaceBody) =>
      createWorkspace(fetcher, values),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

/**
 * Sets the default workspace for the authenticated user.
 */
export function useSetDefaultWorkspace(
  props?: UseMutationOptions<void, Error, SetDefaultWorkspaceBody>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (values: SetDefaultWorkspaceBody) =>
      setDefaultWorkspace(fetcher, values),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

/**
 * Deletes a workspace (owner only).
 */
export function useDeleteWorkspace(
  props?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (organizationId: string) =>
      deleteWorkspace(fetcher, organizationId),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

/**
 * Inactivates a workspace (owner only).
 */
export function useInactivateWorkspace(
  props?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (organizationId: string) =>
      inactivateWorkspace(fetcher, organizationId),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

/**
 * Activates (reactivates) a workspace (owner only).
 */
export function useActivateWorkspace(
  props?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (organizationId: string) =>
      activateWorkspace(fetcher, organizationId),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

export type { WorkspacesListResponse };
