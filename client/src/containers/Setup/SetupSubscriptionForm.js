import React, { useMemo } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { Button, Intent } from '@blueprintjs/core';
import BillingPlans from 'containers/Subscriptions/billingPlans';
import BillingPeriods from 'containers/Subscriptions/billingPeriods';
import { BillingPaymentmethod } from 'containers/Subscriptions/billingPaymentmethod';

import withBillingActions from 'containers/Subscriptions/withBillingActions';
import { compose } from 'utils';

/**
 * Subscription step of wizard setup.
 */
function SetupSubscriptionForm({
  //#withBillingActions
  requestSubmitBilling,
}) {
  const { formatMessage } = useIntl();

  const validationSchema = Yup.object().shape({
    plan_slug: Yup.string()
      .required()
      .label(formatMessage({ id: 'plan_slug' })),
    license_code: Yup.string().trim(),
  });

  const initialValues = useMemo(
    () => ({
      plan_slug: '',
      license_code: '',
    }),
    [],
  );

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema: validationSchema,
    initialValues: {
      ...initialValues,
    },
    onSubmit: (values, { setSubmitting, setErrors }) => {
      requestSubmitBilling(values)
        .then((response) => {
          setSubmitting(false);
        })
        .catch((errors) => {
          setSubmitting(false);
        });
    },
  });
  return (
    <div className={'register-subscription-form'}>
      <form onSubmit={formik.handleSubmit} className={'billing-form'}>
        <BillingPlans title={'a_select_a_plan'} formik={formik} />
        <BillingPeriods title={'b_choose_your_billing'} formik={formik} />
        <BillingPaymentmethod title={'c_payment_methods'} formik={formik} />

        <div className={'subscribe-button'}>
          <Button
            intent={Intent.PRIMARY}
            type="submit"
            loading={formik.isSubmitting}
          >
            <T id={'subscribe'} />
          </Button>
        </div>
      </form>
    </div>
  );
}

export default compose(
  withBillingActions,
)(SetupSubscriptionForm);
