// Query key constants
export const ORGANIZATIONS = 'ORGANIZATIONS';
export const ORGANIZATION_CURRENT = 'ORGANIZATION_CURRENT';
export const ORGANIZATION_MUTATE_BASE_CURRENCY_ABILITIES =
  'ORGANIZATION_MUTATE_BASE_CURRENCY_ABILITIES';

// Query key factory
export const organizationKeys = {
  all: () => [ORGANIZATIONS] as const,
  current: () => [ORGANIZATION_CURRENT] as const,
  mutateAbilities: () => [ORGANIZATION_MUTATE_BASE_CURRENCY_ABILITIES] as const,
};

// Grouped object for use in components/hooks
export const OrganizationQueryKeys = {
  ORGANIZATIONS,
  ORGANIZATION_CURRENT,
  ORGANIZATION_MUTATE_BASE_CURRENCY_ABILITIES,
} as const;

/** @deprecated Use OrganizationQueryKeys */
export const OrganizationsQueryKeys = OrganizationQueryKeys;
