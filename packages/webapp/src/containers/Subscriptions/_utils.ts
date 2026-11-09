import type { SubscriptionsListResponse } from '@bigcapital/sdk-ts';

type SubscriptionDetails = SubscriptionsListResponse['subscriptions'][number];

export const getSubscriptionStatusText = (
  subscription: SubscriptionDetails,
): string => {
  if (subscription.status === 'on_trial') {
    return subscription.onTrial
      ? `Trial ends on ${subscription.trialEndsAtFormatted}`
      : `Trial ended on ${subscription.trialEndsAtFormatted}`;
  }
  if (subscription.status === 'past_due') {
    return 'Payment failed. Please update your billing information.';
  }
  if (subscription.status === 'active') {
    if (subscription.cancelAtPeriodEnd) {
      return subscription.endsAtFormatted
        ? `Cancels on ${subscription.endsAtFormatted}`
        : 'Scheduled for cancellation';
    }
    return subscription.endsAtFormatted
      ? `Renews on ${subscription.endsAtFormatted}`
      : 'Lifetime subscription';
  }
  if (subscription.status === 'canceled') {
    return subscription.ended
      ? `Expired on ${subscription.endsAtFormatted}`
      : `Expires on ${subscription.endsAtFormatted}`;
  }
  return '';
};
