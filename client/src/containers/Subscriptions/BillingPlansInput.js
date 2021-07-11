import React from 'react';
import { FastField, Field } from 'formik';
import BillingPlan from './BillingPlan';

import withPlans from './withPlans';
import { compose } from 'utils';

/**
 * Billing plans.
 */
function BillingPlans({ plans, title, description, selectedOption }) {
  return (
    <section class="billing-plans__section">
      <h1 class="title">{title}</h1>
      <div class="description">
        <p className="paragraph">{description}</p>
      </div>

      <Field name={'plan_slug'}>
        {({ form: { setFieldValue }, field: { value } }) => (
          <div className={'plan-radios'}>
            {plans.map((plan) => (
              <BillingPlan
                name={plan.name}
                description={plan.description}
                slug={plan.slug}
                price={plan.price.month}
                currencyCode={plan.currencyCode}
                value={plan.slug}
                onSelected={(value) => setFieldValue('plan_slug', value)}
                selectedOption={value}
              />
            ))}
          </div>
        )}
      </Field>
    </section>
  );
}
export default compose(withPlans(({ plans }) => ({ plans })))(BillingPlans);
