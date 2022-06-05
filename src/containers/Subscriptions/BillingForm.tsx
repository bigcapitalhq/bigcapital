import React, { useEffect } from 'react';
import { Formik, Form } from 'formik';
import intl from 'react-intl-universal';
import { If, Alert, T } from 'components';

import DashboardInsider from 'components/Dashboard/DashboardInsider';

import 'style/pages/Billing/BillingPage.scss';

import { MasterBillingTabs } from './SubscriptionTabs';

import withBillingActions from './withBillingActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withSubscriptionPlansActions from './withSubscriptionPlansActions';

import { compose } from 'utils';
import { getBillingFormValidationSchema } from './utils';
import withSubscriptions from './withSubscriptions';

/**
 * Billing form.
 */
function BillingForm({
  // #withDashboardActions
  changePageTitle,

  // #withBillingActions
  requestSubmitBilling,

  initSubscriptionPlans,

  // #withSubscriptions
  isSubscriptionInactive,
}) {
  useEffect(() => {
    changePageTitle(intl.get('billing'));
  }, [changePageTitle]);

  React.useEffect(() => {
    initSubscriptionPlans();
  }, [initSubscriptionPlans]);

  // Initial values.
  const initialValues = {
    plan_slug: 'essentials',
    period: 'month',
    license_code: '',
  };

  // Handle form submitting.
  const handleSubmit = (values, { setSubmitting }) => {
    requestSubmitBilling({
      ...values,
      plan_slug: 'essentials-monthly',
    })
      .then((response) => {
        setSubmitting(false);
      })
      .catch((errors) => {
        setSubmitting(false);
      });
  };

  return (
    <DashboardInsider name={'billing-page'}>
      <div className={'billing-page'}>
        <If condition={isSubscriptionInactive}>
          <Alert
            intent={'danger'}
            title={<T id={'billing.suspend_message.title'} />}
            description={<T id={'billing.suspend_message.description'} />}
          />
        </If>

        <Formik
          validationSchema={getBillingFormValidationSchema()}
          onSubmit={handleSubmit}
          initialValues={initialValues}
        >
          <Form>
            <MasterBillingTabs />
          </Form>
        </Formik>
      </div>
    </DashboardInsider>
  );
}

export default compose(
  withDashboardActions,
  withBillingActions,
  withSubscriptionPlansActions,
  withSubscriptions(
    ({ isSubscriptionInactive }) => ({ isSubscriptionInactive }),
    'main',
  ),
)(BillingForm);
