// Query key constants for API keys
export const API_KEYS = 'API_KEYS';

// Query key factory
export const apiKeysKeys = {
  all: () => [API_KEYS] as const,
  list: () => [API_KEYS] as const,
};

// Grouped object for use in components/hooks (for backward compatibility)
export const ApiKeysQueryKeys = {
  API_KEYS,
} as const;
