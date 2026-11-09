// Query key constants
export const AUTH_METADATA_PAGE = 'AUTH_META_PAGE';

// Query key factory
export const authenticationKeys = {
  metadata: () => [AUTH_METADATA_PAGE] as const,
};

// Grouped object for use in components/hooks
export const AuthenticationQueryKeys = {
  AUTH_METADATA_PAGE,
} as const;
