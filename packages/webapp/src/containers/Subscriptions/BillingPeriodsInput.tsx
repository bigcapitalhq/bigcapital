// @ts-nocheck
import React from 'react';
import { Field } from 'formik';
import * as R from 'ramda';

import { T, SubscriptionPeriods } from '@/components';

import withPlan from './withPlan';

/**
 * Subscription periods enhanced.
 */
const SubscriptionPeriodsEnhanced = R.compose(
  withPlan(({ plan }) => ({ plan })),
)(({ plan, ...restProps }) => {
  if (!plan) return null;

  return <SubscriptionPeriods periods={plan.periods} {...restProps} />;
});

/**
 * Billing periods.
 */
export default function BillingPeriods() {
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
        {({ field: { value }, form: { values, setFieldValue } }) => (
          <SubscriptionPeriodsEnhanced
            selectedPeriod={value}
            planSlug={values.plan_slug}
            onPeriodSelect={(period) => {
              setFieldValue('period', period);
            }}
          />
        )}
      </Field>
    </section>
  );
}
