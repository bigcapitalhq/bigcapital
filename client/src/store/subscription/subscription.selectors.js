import { createSelector } from '@reduxjs/toolkit';

const subscriptionSelector = (slug) => (state, props) =>  {
  const subscriptions = Object.values(state.subscriptions.data);
  return subscriptions.find((subscription) => subscription.slug === slug);
};

export const isSubscriptionOnTrialFactory = (slug) => createSelector(
  subscriptionSelector(slug),
  (subscription) => !!subscription?.on_trial,
);

export const isSubscriptionActiveFactory = (slug) => createSelector(
  subscriptionSelector(slug),
  (subscription) => {
    return !!subscription?.active;
  }
);

export const isSubscriptionInactiveFactory = (slug) => createSelector(
  subscriptionSelector(slug),
  (subscription) => !!subscription?.inactive,
);