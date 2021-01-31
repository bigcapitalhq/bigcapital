import React from 'react';
import { Form } from 'formik';

import BillingPlansForm from 'containers/Subscriptions/BillingPlansForm';

/**
 * Subscription step of wizard setup.
 */
export default function SetupSubscriptionForm() {
  return (
    <Form>
      <BillingPlansForm />
    </Form>
  );
}
