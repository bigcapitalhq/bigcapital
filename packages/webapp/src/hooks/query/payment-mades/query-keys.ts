// Query key constants
export const PAYMENT_MADES = 'PAYMENT_MADES';
export const PAYMENT_MADE = 'PAYMENT_MADE';
export const PAYMENT_MADE_NEW_ENTRIES = 'PAYMENT_MADE_NEW_ENTRIES';
export const PAYMENT_MADE_EDIT_PAGE = 'PAYMENT_MADE_EDIT_PAGE';

// Query key factory
export const paymentMadesKeys = {
  all: () => [PAYMENT_MADES] as const,
  list: (query?: Record<string, unknown>) => [PAYMENT_MADES, query] as const,
  detail: (id: number | null | undefined) => [PAYMENT_MADE, id] as const,
  editPage: (id: number | null | undefined) =>
    [PAYMENT_MADE_EDIT_PAGE, id] as const,
  newEntries: (vendorId?: number | null) =>
    [PAYMENT_MADE_NEW_ENTRIES, vendorId] as const,
};

// Grouped object for use in components/hooks
export const PaymentMadesQueryKeys = {
  PAYMENT_MADES,
  PAYMENT_MADE,
  PAYMENT_MADE_NEW_ENTRIES,
  PAYMENT_MADE_EDIT_PAGE,
} as const;
