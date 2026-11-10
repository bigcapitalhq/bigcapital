import { Intent } from '@blueprintjs/core';
import { useCallback } from 'react';
import { openPendingTab, redirectPendingTab } from './_utils';
import { useBillingPageBoot } from './BillingPageBoot';
import { AppToaster } from '@/components';
import { useCreateSubscriptionCheckoutSession } from '@/hooks/query/subscription';

/**
 * Starts a Stripe Checkout session for the Go monthly plan.
 * Shared by the trial banner and the subscription card upgrade CTA.
 */
export function useUpgradeToGoCheckout() {
  const { plans } = useBillingPageBoot();
  const { mutateAsync: createCheckoutSession, isPending } =
    useCreateSubscriptionCheckoutSession();

  const goPlan = plans.find((plan) => plan.slug === 'go') || plans[0];
  const monthlyPrice = goPlan?.prices.find(
    (price) => price.interval === 'month',
  );

  const upgrade = useCallback(() => {
    if (!monthlyPrice) return;

    const checkoutTab = openPendingTab();

    createCheckoutSession({ planSlug: monthlyPrice.slug })
      .then(({ url }) => {
        redirectPendingTab(checkoutTab, url);
      })
      .catch(() => {
        checkoutTab?.close();
        AppToaster.show({
          message: 'Unable to start the checkout. Please try again.',
          intent: Intent.DANGER,
        });
      });
  }, [createCheckoutSession, monthlyPrice]);

  return {
    upgrade,
    isPending,
    canUpgrade: !!monthlyPrice,
  };
}
