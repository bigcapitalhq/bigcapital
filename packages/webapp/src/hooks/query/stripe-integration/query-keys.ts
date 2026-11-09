// Query key constants for Stripe integration
export const STRIPE_ACCOUNT_LINK = 'getStripeAccountLink';

// Query key factory
export const stripeIntegrationKeys = {
  all: () => [STRIPE_ACCOUNT_LINK] as const,
  accountLink: () => [STRIPE_ACCOUNT_LINK] as const,
};

// Grouped object for use in components/hooks
export const StripeIntegrationQueryKeys = {
  STRIPE_ACCOUNT_LINK,
} as const;
