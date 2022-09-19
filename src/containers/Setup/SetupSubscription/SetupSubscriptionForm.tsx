// @ts-nocheck
import React from 'react';

import SubscriptionPlansSection from './SubscriptionPlansSection';
import SubscriptionPeriodsSection from './SubscriptionPeriodsSection';
import SubscriptionPaymentMethodsSection from './SubscriptionPaymentsMethodsSection';


export default function SetupSubscriptionForm() {
  return (
    <div class="billing-plans">
      <SubscriptionPlansSection />
      <SubscriptionPeriodsSection />
      <SubscriptionPaymentMethodsSection />
    </div>
  );
}
