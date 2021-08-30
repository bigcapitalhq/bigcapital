import React from 'react';

import 'style/pages/Subscription/BillingPlans.scss';

import BillingPlansInput from './BillingPlansInput';
import BillingPeriodsInput from './BillingPeriodsInput';
import BillingPaymentMethod from './BillingPaymentMethod';

/**
 * Billing plans form.
 */
export default function BillingPlansForm() {
  return (
    <div class="billing-plans">
      <BillingPlansInput />
      <BillingPeriodsInput />
      <BillingPaymentMethod />
    </div>
  );
}
