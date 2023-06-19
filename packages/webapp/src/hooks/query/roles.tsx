// @ts-nocheck
import { useMutation, useQueryClient } from 'react-query';
import { useRequestQuery } from '../useQueryRequest';
import useApiRequest from '../useRequest';
import t from './types';

// Common invalidate queries.
const commonInvalidateQueries = (queryClient) => {
  queryClient.invalidateQueries(t.ROLE);
  queryClient.invalidateQueries(t.ROLES);
  queryClient.invalidateQueries(t.ROLES_PERMISSIONS_SCHEMA);
};

/**
 * Edit role .
 */
export function useEditRolePermissionSchema(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(([id, values]) => apiRequest.post(`roles/${id}`, values), {
    onSuccess: () => {
      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Create a new roles
 */
export function useCreateRolePermissionSchema(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((values) => apiRequest.post(`roles`, values), {
    onSuccess: () => {
      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Delete the given role.
 */
export function useDeleteRole(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.delete(`roles/${id}`), {
    onSuccess: (res, id) => {
      // Invalidate specific role.
      queryClient.invalidateQueries(t.ROLE, id);

      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Retrieve the roles permissions schema.
 */
export function usePermissionsSchema(query, props) {
  return useRequestQuery(
    [t.ROLES_PERMISSIONS_SCHEMA, query],
    { method: 'get', url: 'roles/permissions/schema', params: query },
    {
      select: (res) => res.data.data,
      defaultData: {
        roles: [],
      },
      ...props,
    },
  );
}

/**
 * Retrieve the role permission schema.
 * @param {number} role_id - role id.
 */
export function useRolePermission(role_id, props, requestProps) {
  return useRequestQuery(
    [t.ROLE, role_id],
    { method: 'get', url: `roles/${role_id}`, ...requestProps },
    {
      select: (res) => res.data.role,
      defaultData: {},
      ...props,
    },
  );
}

/**
 * Retrieve the roles.
 */
export function useRoles(props, query) {
  return useRequestQuery(
    [t.ROLES, query],
    { method: 'get', url: `roles`, params: query },
    {
      select: (res) => res.data.roles,
      defaultData: [],
      ...props,
    },
  );
}
