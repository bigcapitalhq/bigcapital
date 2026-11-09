// Query key constants for payment methods
export const PAYMENT_METHOD = 'PAYMENT_METHOD';

// Query key factory
export const paymentMethodsKeys = {
  all: () => [PAYMENT_METHOD] as const,
  detail: (id: number | string) => [PAYMENT_METHOD, id] as const,
};

// Grouped object for use in components/hooks
export const PaymentMethodsQueryKeys = {
  PAYMENT_METHOD,
} as const;
