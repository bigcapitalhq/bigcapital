// @ts-nocheck
import React from 'react';

import { T } from '@/components';
import { PaymentMethodTabs } from './SubscriptionTabs';

export default ({ formik, title, description }) => {
  return (
    <section class="billing-plans__section">
      <h1 className="title"><T id={'setup.plans.payment_methods.title'} /></h1>
      <p className="paragraph"><T id={'setup.plans.payment_methods.description' } /></p>

      <PaymentMethodTabs formik={formik} />
    </section>
  );
};
