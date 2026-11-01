// Query key constants
export const ROLE = 'ROLE';
export const ROLES = 'ROLES';
export const ROLES_PERMISSIONS_SCHEMA = 'ROLES_PERMISSIONS_SCHEMA';

// Query key factory
export const rolesKeys = {
  all: () => [ROLES] as const,
  detail: (id: number | null | undefined) => [ROLE, id] as const,
  permissionsSchema: () => [ROLES_PERMISSIONS_SCHEMA] as const,
};

// Grouped object for use in components/hooks
export const RolesQueryKeys = {
  ROLE,
  ROLES,
  ROLES_PERMISSIONS_SCHEMA,
} as const;
