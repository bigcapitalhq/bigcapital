import React, { useState, useRef, useEffect } from 'react';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { PaymentMethodTabs } from './SubscriptionTabs';

export const BillingPaymentmethod = ({ formik, title }) => {
  return (
    <section>
      <h1 className={'bg-title'}>
        <T id={title} />
      </h1>
      <p className={'bg-message'}>
        <T id={'please_enter_your_preferred_payment_method'} />
      </p>
      <PaymentMethodTabs formik={formik} />
    </section>
  );
};
