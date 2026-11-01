// Query key constants for payment services
export const PAYMENT_SERVICES = 'PaymentServices';
export const PAYMENT_SERVICES_STATE = 'PaymentServicesState';

// Query key factory
export const paymentServicesKeys = {
  all: () => [PAYMENT_SERVICES] as const,
  list: () => [PAYMENT_SERVICES] as const,
  detail: (id: number | string) => [PAYMENT_SERVICES, id] as const,
  state: () => [PAYMENT_SERVICES_STATE] as const,
};

// Grouped object for use in components/hooks
export const PaymentServicesQueryKeys = {
  PAYMENT_SERVICES,
  PAYMENT_SERVICES_STATE,
} as const;
