import { Callout, Intent } from '@blueprintjs/core';
import { useState } from 'react';
import { useBillingPageBoot } from './BillingPageBoot';
import {
  SubscriptionPlan,
  SubscriptionPlansPeriod,
} from './component/SubscriptionPlan';
import { SubscriptionPlansPeriodSwitcher } from './components/SubscriptionPlansPeriodSwitcher';
import { AppToaster, Box, Group } from '@/components';
import { useCreateSubscriptionCheckoutSession } from '@/hooks/query/subscription';

/**
 * Plan selection shown when the organization has no active subscription.
 */
export function BillingPlansSection() {
  const { plans, mainSubscription } = useBillingPageBoot();
  const [period, setPeriod] = useState<SubscriptionPlansPeriod>('monthly');
  const { mutateAsync: createCheckoutSession, isPending } =
    useCreateSubscriptionCheckoutSession();

  const handleSubscribe = (planSlug: string) => {
    createCheckoutSession({ planSlug })
      .then(({ url }) => {
        window.location.assign(url);
      })
      .catch(() => {
        AppToaster.show({
          message: 'Unable to start the checkout. Please try again.',
          intent: Intent.DANGER,
        });
      });
  };

  if (!plans.length) {
    return null;
  }

  return (
    <Box id="billing-plans" style={{ marginTop: '2rem' }}>
      <Callout icon={null} style={{ marginBottom: '1.6rem' }}>
        Upgrade to Go for unlimited invoices and bills, and access to every
        feature. You can change or cancel your plan at any time from this page.
      </Callout>

      <SubscriptionPlansPeriodSwitcher period={period} onChange={setPeriod} />

      <Group spacing={14} noWrap align="stretch">
        {plans.map((plan) => (
          <SubscriptionPlan
            key={plan.slug}
            plan={plan}
            period={period}
            currentPlanSlug={
              mainSubscription?.active ? mainSubscription.planSlug : undefined
            }
            onSubscribe={handleSubscribe}
            subscribeButtonProps={{ loading: isPending }}
          />
        ))}
      </Group>
    </Box>
  );
}
