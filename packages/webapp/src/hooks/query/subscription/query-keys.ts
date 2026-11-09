// Query key constants for subscription
export const SUBSCRIPTIONS = 'GetSubscriptions';

// Query key factory
export const subscriptionKeys = {
  all: () => [SUBSCRIPTIONS] as const,
  list: () => [SUBSCRIPTIONS] as const,
  plans: () => [SUBSCRIPTIONS, 'plans'] as const,
  billingOverview: () => [SUBSCRIPTIONS, 'billing-overview'] as const,
};

// Grouped object for use in components/hooks
export const SubscriptionQueryKeys = {
  SUBSCRIPTIONS,
} as const;
