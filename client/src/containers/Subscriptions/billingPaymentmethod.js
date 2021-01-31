import React from 'react';
import { PaymentMethodTabs } from './SubscriptionTabs';

export default ({ formik, title, description }) => {
  return (
    <section class="billing-plans__section">
      <h1 className="title">{ title }</h1>
      <p className="paragraph">{ description }</p>

      <PaymentMethodTabs formik={formik} />
    </section>
  );
};
