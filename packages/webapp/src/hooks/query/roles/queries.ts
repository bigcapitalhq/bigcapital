import {
  fetchRoles,
  fetchRole,
  fetchRolePermissionsSchema,
  createRole,
  editRole,
  deleteRole,
} from '@bigcapital/sdk-ts';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';
import { rolesKeys } from './query-keys';
import type {
  RolesListResponse,
  Role,
  RolePermissionsSchema,
  CreateRoleBody,
  EditRoleBody,
} from '@bigcapital/sdk-ts';

const commonInvalidateQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  queryClient.invalidateQueries({ queryKey: rolesKeys.all() });
  queryClient.invalidateQueries({ queryKey: rolesKeys.permissionsSchema() });
};

export function useEditRolePermissionSchema(
  props?: UseMutationOptions<void, Error, [number, EditRoleBody]>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();
  return useMutation({
    ...props,
    mutationFn: ([id, values]: [number, EditRoleBody]) =>
      editRole(fetcher, id, values),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

export function useCreateRolePermissionSchema(
  props?: UseMutationOptions<void, Error, CreateRoleBody>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();
  return useMutation({
    ...props,
    mutationFn: (values: CreateRoleBody) => createRole(fetcher, values),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

export function useDeleteRole(props?: UseMutationOptions<void, Error, number>) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();
  return useMutation({
    ...props,
    mutationFn: (id: number) => deleteRole(fetcher, id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.detail(id) });
      commonInvalidateQueries(queryClient);
    },
  });
}

export function usePermissionsSchema(
  query?: Record<string, unknown>,
  props?: Omit<UseQueryOptions<RolePermissionsSchema>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher();
  return useQuery({
    ...props,
    queryKey: [...rolesKeys.permissionsSchema(), query],
    queryFn: () => fetchRolePermissionsSchema(fetcher),
  });
}

export function useRolePermission(
  role_id: number | null | undefined,
  props?: Omit<UseQueryOptions<Role>, 'queryKey' | 'queryFn'>,
  _requestProps?: Record<string, unknown>,
) {
  const fetcher = useApiFetcher();
  return useQuery({
    ...props,
    queryKey: rolesKeys.detail(role_id),
    queryFn: () => fetchRole(fetcher, role_id!),
    enabled: role_id != null,
  });
}

export function useRoles(
  query?: Record<string, unknown>,
  props?: Omit<UseQueryOptions<RolesListResponse>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher();
  return useQuery({
    ...props,
    queryKey: [...rolesKeys.all(), query],
    queryFn: () => fetchRoles(fetcher),
  });
}
