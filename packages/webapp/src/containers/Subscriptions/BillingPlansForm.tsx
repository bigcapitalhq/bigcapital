// @ts-nocheck
import React from 'react';
import * as R from 'ramda';

import '@/style/pages/Subscription/BillingPlans.scss';

import BillingPlansInput from './BillingPlansInput';
import BillingPeriodsInput from './BillingPeriodsInput';
import BillingPaymentMethod from './BillingPaymentMethod';

import withSubscriptions from './withSubscriptions';

/**
 * Billing plans form.
 */
export default function BillingPlansForm() {
  return (
    <div class="billing-plans">
      <BillingPlansInput />
      <BillingPeriodsInput />
      <BillingPaymentMethodWhenSubscriptionInactive />
    </div>
  );
}

/**
 * Billing payment methods when subscription is inactive.
 * @returns {JSX.Element}
 */
function BillingPaymentMethodWhenSubscriptionInactiveJSX({
  // # withSubscriptions
  isSubscriptionActive,

  ...props
}) {
  return !isSubscriptionActive ? <BillingPaymentMethod {...props} /> : null;
}

const BillingPaymentMethodWhenSubscriptionInactive = R.compose(
  withSubscriptions(({ isSubscriptionActive }) => ({ isSubscriptionActive })),
)(BillingPaymentMethodWhenSubscriptionInactiveJSX);
