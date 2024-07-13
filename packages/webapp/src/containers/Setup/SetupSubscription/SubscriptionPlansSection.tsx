import { Callout } from '@blueprintjs/core';
import { SubscriptionPlans } from './SubscriptionPlans';
import { SubscriptionPlansPeriodSwitcher } from './SubscriptionPlansPeriodSwitcher';

/**
 * Billing plans.
 */
export function SubscriptionPlansSection() {
  return (
    <section>
      <Callout style={{ marginBottom: '2rem' }} icon={null}>
        Simple plans. Simple prices. Only pay for what you really need. All
        plans come with award-winning 24/7 customer support. Prices do not
        include applicable taxes.
      </Callout>

      <SubscriptionPlansPeriodSwitcher />
      <SubscriptionPlans />
    </section>
  );
}
