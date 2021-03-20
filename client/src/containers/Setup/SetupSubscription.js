import React from 'react';
import { Formik } from 'formik';

import 'style/pages/Setup/Subscription.scss';

import SetupSubscriptionForm from './SetupSubscriptionForm';
import { SubscriptionFormSchema } from './SubscriptionForm.schema';

/**
 * Subscription step of wizard setup.
 */
export default function SetupSubscription() {
  // Initial values.
  const initialValues = {
    plan_slug: 'free',
    period: 'month',
    license_code: '',
  };

  // Handle form submit.
  const handleSubmit = () => {};

  return (
    <div className={'setup-subscription-form'}>  
      <Formik
        validationSchema={SubscriptionFormSchema}
        initialValues={initialValues}
        component={SetupSubscriptionForm}
        onSubmit={handleSubmit}
      />
    </div>
  );
}