import React from 'react';
import { Field } from 'formik';
import BillingPeriod from './BillingPeriod';

import withPlans from './withPlans';

import { compose } from 'utils';

/**
 * Billing periods.
 */
function BillingPeriods({ title, description, plansPeriods }) {
  return (
    <section class="billing-plans__section">
      <h1 class="title">{title}</h1>
      <div class="description">
        <p className="paragraph">{description}</p>
      </div>

      <Field name={'period'}>
        {({ form: { setFieldValue, values } }) => (
          <div className={'plan-periods'}>
            {plansPeriods.map((period) => (
              <BillingPeriod
                planSlug={values.plan_slug}
                period={period.slug}
                label={period.label}
                value={period.slug}
                onSelected={(value) => setFieldValue('period', value)}
                selectedOption={values.period}
              />
            ))}
          </div>
        )}
      </Field>
    </section>
  );
}

export default compose(withPlans(({ plansPeriods }) => ({ plansPeriods })))(
  BillingPeriods,
);
