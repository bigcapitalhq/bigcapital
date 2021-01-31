import React from 'react';
import { Formik } from 'formik';
import { withWizard } from 'react-albus';

import 'style/pages/Setup/Subscription.scss';

import SetupSubscriptionForm from './SetupSubscriptionForm';
import { SubscriptionFormSchema } from './SubscriptionForm.schema';

import { compose } from 'utils';

/**
 * Subscription step of wizard setup.
 */
function SetupSubscription({
  // #withWizard
  wizard,
}) {
  // Initial values.
  const initialValues = {
    plan_slug: 'free',
    period: 'month',
    license_code: '',
  };

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

export default compose(
  withWizard,
)(SetupSubscription);
