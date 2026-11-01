// Query key constants
export const VENDORS = 'VENDORS';
export const VENDOR = 'VENDOR';

// Query key factory
export const vendorsKeys = {
  all: () => [VENDORS] as const,
  list: (query?: Record<string, unknown>) => [VENDORS, query] as const,
  detail: (id: number | null | undefined) => [VENDOR, id] as const,
};

// Grouped object for use in components/hooks
export const VendorsQueryKeys = {
  VENDORS,
  VENDOR,
} as const;
