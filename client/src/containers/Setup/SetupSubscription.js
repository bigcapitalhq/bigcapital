import React from 'react';
import { Formik } from 'formik';
import * as R from 'ramda';

import 'style/pages/Setup/Subscription.scss';

import SetupSubscriptionForm from './SetupSubscriptionForm';
import { getSubscriptionFormSchema } from './SubscriptionForm.schema';
import withSubscriptionPlansActions from '../Subscriptions/withSubscriptionPlansActions';

/**
 * Subscription step of wizard setup.
 */
function SetupSubscription({
  // #withSubscriptionPlansActions
  initSubscriptionPlans
}) {
  React.useEffect(() => {
    initSubscriptionPlans();
  }, [
    initSubscriptionPlans
  ]);

  // Initial values.
  const initialValues = {
    plan_slug: 'starter',
    period: 'month',
    license_code: '',
  };
  // Handle form submit.
  const handleSubmit = () => {};

  const SubscriptionFormSchema = getSubscriptionFormSchema();

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

export default R.compose(
  withSubscriptionPlansActions,
)(SetupSubscription);