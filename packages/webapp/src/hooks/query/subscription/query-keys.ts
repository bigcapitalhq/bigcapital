// Query key constants for subscription
export const SUBSCRIPTIONS = 'GetSubscriptions';

// Query key factory
export const subscriptionKeys = {
  all: () => [SUBSCRIPTIONS] as const,
  list: () => [SUBSCRIPTIONS] as const,
  lemon: () => [SUBSCRIPTIONS, 'lemon'] as const,
};

// Grouped object for use in components/hooks
export const SubscriptionQueryKeys = {
  SUBSCRIPTIONS,
} as const;
