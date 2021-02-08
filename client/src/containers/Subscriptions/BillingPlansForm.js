import React from 'react';
import { FormattedMessage as T } from 'react-intl';

import 'style/pages/Subscription/BillingPlans.scss'

import BillingPlansInput from 'containers/Subscriptions/BillingPlansInput';
import BillingPeriodsInput from 'containers/Subscriptions/BillingPeriodsInput';
import BillingPaymentMethod from 'containers/Subscriptions/BillingPaymentmethod';

/**
 * Billing plans form.
 */
export default function BillingPlansForm() {
  return (
    <div class="billing-plans">
      <BillingPlansInput
        title={<T id={'select_a_plan'} values={{ order: 1 }} />}
        description={<T id={'please_enter_your_preferred_payment_method'} />}
      />
      <BillingPeriodsInput
        title={<T id={'choose_your_billing'} values={{ order: 2 }} />}
        description={<T id={'please_enter_your_preferred_payment_method'} />}
      />
      <BillingPaymentMethod
        title={<T id={'payment_methods'} values={{ order: 3 }} />}
        description={<T id={'please_enter_your_preferred_payment_method'} />}
      />
    </div>
  )
}