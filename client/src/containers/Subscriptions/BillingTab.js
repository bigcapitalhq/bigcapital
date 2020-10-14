import React from 'react';
import BillingPlans from 'containers/Subscriptions/billingPlans';
import BillingPeriods from 'containers/Subscriptions/billingPeriods';
import { BillingPaymentmethod } from 'containers/Subscriptions/billingPaymentmethod';

function BillingTab({ formik }) {
  return (
    <div>
      <BillingPlans title={'a_select_a_plan'} formik={formik} />
      <BillingPeriods title={'b_choose_your_billing'} formik={formik} />
      <BillingPaymentmethod title={'c_payment_methods'} formik={formik} />
    </div>
  );
}

export default BillingTab;
