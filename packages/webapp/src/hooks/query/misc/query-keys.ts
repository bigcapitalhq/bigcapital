// Query key constants
export const DATE_FORMATS = 'DATE_FORMATS';

// Query key factory
export const miscKeys = {
  dateFormats: () => [DATE_FORMATS] as const,
};

// Grouped object for use in components/hooks
export const MiscQueryKeys = {
  DATE_FORMATS,
} as const;
