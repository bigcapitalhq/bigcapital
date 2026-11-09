// Query key constants
export const VENDOR_CREDITS = 'VENDOR_CREDITS';
export const VENDOR_CREDIT = 'VENDOR_CREDIT';
export const REFUND_VENDOR_CREDIT = 'REFUND_VENDOR_CREDIT';
export const REFUND_VENDOR_CREDIT_TRANSACTION =
  'REFUND_VENDOR_CREDIT_TRANSACTION';
export const RECONCILE_VENDOR_CREDIT = 'RECONCILE_VENDOR_CREDIT';
export const RECONCILE_VENDOR_CREDITS = 'RECONCILE_VENDOR_CREDITS';

// Query key factory
export const vendorCreditsKeys = {
  all: () => [VENDOR_CREDITS] as const,
  list: (query?: Record<string, unknown>) => [VENDOR_CREDITS, query] as const,
  detail: (id: number | null | undefined) => [VENDOR_CREDIT, id] as const,
  refund: (id: number | null | undefined) =>
    [REFUND_VENDOR_CREDIT, id] as const,
  refundTransaction: (id: number | null | undefined) =>
    [REFUND_VENDOR_CREDIT_TRANSACTION, id] as const,
  reconcile: (id: number | null | undefined) =>
    [RECONCILE_VENDOR_CREDIT, id] as const,
  reconciles: (id: number | null | undefined) =>
    [RECONCILE_VENDOR_CREDITS, id] as const,
};

// Grouped object for use in components/hooks
export const VendorCreditsQueryKeys = {
  VENDOR_CREDITS,
  VENDOR_CREDIT,
  REFUND_VENDOR_CREDIT,
  REFUND_VENDOR_CREDIT_TRANSACTION,
  RECONCILE_VENDOR_CREDIT,
  RECONCILE_VENDOR_CREDITS,
} as const;
