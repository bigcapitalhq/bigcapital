// @ts-nocheck
import { T } from '@/components';

import { SubscriptionPlans } from './SubscriptionPlan';
import withPlans from '../../Subscriptions/withPlans';
import { compose } from '@/utils';

/**
 * Billing plans.
 */
function SubscriptionPlansSectionRoot({ plans }) {
  return (
    <section>
      <p className="paragraph" style={{ marginBottom: '1.2rem' }}>
        <T id={'setup.plans.select_plan.description'} />
      </p>

      <SubscriptionPlans plans={plans} />
    </section>
  );
}

export const SubscriptionPlansSection = compose(
  withPlans(({ plans }) => ({ plans })),
)(SubscriptionPlansSectionRoot);
