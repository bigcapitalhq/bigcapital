import type { SubscriptionsListResponse } from '@bigcapital/sdk-ts';

type SubscriptionDetails = SubscriptionsListResponse['subscriptions'][number];

/**
 * Opens a blank browser tab synchronously so the browser treats it as part of
 * the current user gesture. The tab can be navigated once the Stripe URL is
 * ready.
 */
export function openPendingTab(): Window | null {
  const tab = window.open('', '_blank');
  if (tab) {
    tab.opener = null;
  }
  return tab;
}

/**
 * Navigates the pending tab to the given URL. Falls back to the current tab
 * when the popup was blocked or the tab was closed.
 */
export function redirectPendingTab(tab: Window | null, url: string): void {
  if (tab && !tab.closed) {
    tab.location.replace(url);
    return;
  }
  window.location.assign(url);
}

export const getSubscriptionStatusText = (
  subscription: SubscriptionDetails,
): string => {
  if (subscription.status === 'on_trial') {
    return subscription.onTrial
      ? `Trial ends on ${subscription.trialEndsAtFormatted}`
      : `Trial ended on ${subscription.trialEndsAtFormatted}`;
  }
  if (subscription.status === 'inactive' && subscription.trialEndsAt) {
    return `Trial ended on ${subscription.trialEndsAtFormatted}`;
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
