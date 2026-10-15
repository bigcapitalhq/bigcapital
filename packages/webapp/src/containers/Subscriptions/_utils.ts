import type { SubscriptionsListResponse } from '@bigcapital/sdk-ts';

type SubscriptionDetails = SubscriptionsListResponse['subscriptions'][number];

export const getSubscriptionStatusText = (
  subscription: SubscriptionDetails,
): string => {
  if (subscription.status === 'on_trial') {
    return subscription.onTrial
      ? `Trials ends in ${subscription.trialEndsAtFormatted}`
      : `Trial ended ${subscription.trialEndsAtFormatted}`;
  } else if (subscription.status === 'active') {
    return subscription.endsAtFormatted
      ? `Renews in ${subscription.endsAtFormatted}`
      : 'Lifetime subscription';
  } else if (subscription.status === 'canceled') {
    return subscription.ended
      ? `Expires ${subscription.endsAtFormatted}`
      : `Expired ${subscription.endsAtFormatted}`;
  }
  return '';
};
