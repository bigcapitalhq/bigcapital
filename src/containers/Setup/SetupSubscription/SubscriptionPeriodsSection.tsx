// @ts-nocheck
import React from 'react';
import { Field } from 'formik';
import * as R from 'ramda';

import { T, SubscriptionPeriods } from '@/components';

import withPlan from '../../Subscriptions/withPlan';

const SubscriptionPeriodsEnhanced = R.compose(
  withPlan(({ plan }) => ({ plan })),
)(({ plan, ...restProps }) => {
  // Can't continue if the current plan of the form not selected.
  if (!plan) {
    return null;
  }
  return <SubscriptionPeriods periods={plan.periods} {...restProps} />;
});

/**
 * Billing periods.
 */
export default function SubscriptionPeriodsSection() {
  return (
    <section class="billing-plans__section">
      <h1 class="title">
        <T id={'setup.plans.select_period.title'} />
      </h1>
      <div class="description">
        <p className="paragraph">
          <T id={'setup.plans.select_period.description'} />
        </p>
      </div>

      <Field name={'period'}>
        {({ form: { setFieldValue, values }, field: { value } }) => (
          <SubscriptionPeriodsEnhanced
            planSlug={values.plan_slug}
            selectedPeriod={value}
            onPeriodSelect={(period) => {
              setFieldValue('period', period);
            }}
          />
        )}
      </Field>
    </section>
  );
}
