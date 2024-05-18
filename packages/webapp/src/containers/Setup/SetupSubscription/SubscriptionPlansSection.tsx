// @ts-nocheck
import { Callout } from '@blueprintjs/core';
import { SubscriptionPlans } from './SubscriptionPlan';
import withPlans from '../../Subscriptions/withPlans';
import { compose } from '@/utils';

/**
 * Billing plans.
 */
function SubscriptionPlansSectionRoot({ plans }) {
  return (
    <section>
      <Callout
        style={{ marginBottom: '1.5rem' }}
        icon={null}
        title={'Early Adopter Plan'}
      >
        We're looking for 200 early adopters, when you subscribe you'll get the
        full features and unlimited users for a year regardless of the
        subscribed plan.
      </Callout>
      <SubscriptionPlans plans={plans} />
    </section>
  );
}

export const SubscriptionPlansSection = compose(
  withPlans(({ plans }) => ({ plans })),
)(SubscriptionPlansSectionRoot);
