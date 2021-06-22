import React from 'react';
import { FormattedMessage as T } from 'components';
import intl from 'react-intl-universal';

import 'style/pages/Subscription/BillingPlans.scss';

import BillingPlansInput from 'containers/Subscriptions/BillingPlansInput';
import BillingPeriodsInput from 'containers/Subscriptions/BillingPeriodsInput';
import BillingPaymentMethod from 'containers/Subscriptions/BillingPaymentMethod';

/**
 * Billing plans form.
 */
export default function BillingPlansForm() {
  return (
    <div class="billing-plans">
      <BillingPlansInput
        title={intl.get('select_a_plan')}
        description={<T id={'please_enter_your_preferred_payment_method'} />}
      />
      <BillingPeriodsInput
        title={intl.get('choose_your_billing')}
        description={<T id={'please_enter_your_preferred_payment_method'} />}
      />
      <BillingPaymentMethod
        title={intl.get('payment_methods')}
        description={<T id={'please_enter_your_preferred_payment_method'} />}
      />
    </div>
  );
}
