// @ts-nocheck
import { createSelector } from '@reduxjs/toolkit';
import { includes } from 'lodash';

const subscriptionSelector = (slug) => (state, props) => {
  const subscriptions = Object.values(state.subscriptions.data);
  return subscriptions.find(
    (subscription) => subscription.slug === (slug || props.subscriptionType),
  );
};

const subscriptionsSelector = (state, props) => {
  const subscriptions = Object.values(state.subscriptions.data);
  return subscriptions.filter(
    (subscription) =>
      includes(props.subscriptionTypes, subscription.slug) ||
      !props.subscriptionTypes,
  );
};

export const isSubscriptionOnTrialFactory = (slug) =>
  createSelector(
    subscriptionSelector(slug),
    (subscription) => !!subscription?.on_trial,
  );

export const isSubscriptionActiveFactory = (slug) =>
  createSelector(subscriptionSelector(slug), (subscription) => {
    return !!subscription?.active;
  });

export const isSubscriptionInactiveFactory = (slug) =>
  createSelector(
    subscriptionSelector(slug),
    (subscription) => !!subscription?.inactive,
  );

export const isSubscriptionsInactiveFactory = () =>
  createSelector(subscriptionsSelector, (subscriptions) =>
    subscriptions.some((subscription) => subscription?.inactive),
  );

export const isSubscriptionsActiveFactory = () =>
  createSelector(subscriptionsSelector, (subscriptions) =>
    subscriptions.some((subscription) => subscription?.active),
  );
