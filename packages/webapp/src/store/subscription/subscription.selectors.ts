import { createSelector } from '@reduxjs/toolkit';
import { includes } from 'lodash';
import type { RootState } from '@/store/reducers';

type SubscriptionRecord = Record<string, unknown>;
type SubscriptionProps = { subscriptionType?: string; subscriptionTypes?: Array<string> };

const subscriptionSelector =
  (slug?: string) =>
  (state: RootState, props: SubscriptionProps): SubscriptionRecord | undefined => {
    const subscriptions = Object.values(state.subscriptions.data) as SubscriptionRecord[];
    return subscriptions.find(
      (subscription) => subscription['slug'] === (slug || props.subscriptionType),
    );
  };

const subscriptionsSelector = (
  state: RootState,
  props: SubscriptionProps,
): SubscriptionRecord[] => {
  const subscriptions = Object.values(state.subscriptions.data) as SubscriptionRecord[];
  return subscriptions.filter(
    (subscription) =>
      includes(props.subscriptionTypes, subscription['slug']) || !props.subscriptionTypes,
  );
};

export const isSubscriptionOnTrialFactory = (slug?: string) =>
  createSelector(
    subscriptionSelector(slug),
    (subscription) => !!(subscription as SubscriptionRecord | undefined)?.['on_trial'],
  );

export const isSubscriptionActiveFactory = (slug?: string) =>
  createSelector(subscriptionSelector(slug), (subscription) => {
    return !!(subscription as SubscriptionRecord | undefined)?.['active'];
  });

export const isSubscriptionInactiveFactory = (slug?: string) =>
  createSelector(
    subscriptionSelector(slug),
    (subscription) => !!(subscription as SubscriptionRecord | undefined)?.['inactive'],
  );

export const isSubscriptionsInactiveFactory = () =>
  createSelector(subscriptionsSelector, (subscriptions) =>
    subscriptions.some((subscription) => subscription?.['inactive']),
  );

export const isSubscriptionsActiveFactory = () =>
  createSelector(subscriptionsSelector, (subscriptions) =>
    subscriptions.some((subscription) => subscription?.['active']),
  );
