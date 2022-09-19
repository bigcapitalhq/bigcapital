// @ts-nocheck
import React from 'react';
import { Field } from 'formik';

import { T, SubscriptionPlans } from '@/components';

import { compose } from '@/utils';
import withPlans from '../../Subscriptions/withPlans';

/**
 * Billing plans.
 */
function SubscriptionPlansSection({ plans }) {
  return (
    <section class="billing-plans__section">
      <h1 class="title">
        <T id={'setup.plans.select_plan.title'} />
      </h1>
      <div class="description">
        <p className="paragraph">
          <T id={'setup.plans.select_plan.description'} />
        </p>
      </div>

      <Field name={'plan_slug'}>
        {({ form: { setFieldValue }, field: { value } }) => (
          <SubscriptionPlans
            value={value}
            plans={plans}
            onSelect={(value) => {
              setFieldValue('plan_slug', value);
            }}
          />
        )}
      </Field>
    </section>
  );
}

export default compose(withPlans(({ plans }) => ({ plans })))(
  SubscriptionPlansSection,
);
