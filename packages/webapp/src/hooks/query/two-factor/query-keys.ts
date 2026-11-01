// Query key constants for two-factor authentication
export const TWO_FACTOR = 'TWO_FACTOR';
export const ORGANIZATION_TWO_FACTOR = 'ORGANIZATION_TWO_FACTOR';

// Query key factory
export const twoFactorKeys = {
  all: () => [TWO_FACTOR] as const,
  status: () => [TWO_FACTOR, 'status'] as const,
  organization: () => [ORGANIZATION_TWO_FACTOR] as const,
};
