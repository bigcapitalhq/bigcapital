import React, { useEffect } from 'react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { FormattedMessage as T, useIntl } from 'react-intl';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import 'style/pages/Billing/BillingPage.scss';

import { MasterBillingTabs } from './SubscriptionTabs';

import withBillingActions from './withBillingActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import { compose } from 'utils';

/**
 * Billing form.
 */
function BillingForm({
  // #withDashboardActions
  changePageTitle,

  //#withBillingActions
  requestSubmitBilling,
}) {
  const { formatMessage } = useIntl();

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'billing' }));
  }, [changePageTitle, formatMessage]);

  const validationSchema = Yup.object().shape({
    plan_slug: Yup.string()
      .required(),
    period: Yup.string().required(),
    license_code: Yup.string().trim(),
  });

  const initialValues = {
    plan_slug: 'free',
    period: 'month',
    license_code: '',
  };

  const handleSubmit = (values, { setSubmitting }) => {
    requestSubmitBilling(values)
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
        <Formik
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          initialValues={initialValues}
        >
          {({ isSubmitting, handleSubmit }) => (
            <Form>
              <MasterBillingTabs />
            </Form>
          )}
        </Formik>
      </div>
    </DashboardInsider>
  );
}

export default compose(withDashboardActions, withBillingActions)(BillingForm);
