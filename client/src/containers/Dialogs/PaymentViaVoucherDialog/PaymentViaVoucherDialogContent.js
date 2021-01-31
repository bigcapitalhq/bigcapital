import React from 'react';
import { Formik } from 'formik';

import { useIntl } from 'react-intl';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';

import 'style/pages/Setup/PaymentViaVoucherDialog.scss';


import { DialogContent } from 'components';
import PaymentViaLicenseForm from './PaymentViaVoucherForm';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withBillingActions from 'containers/Subscriptions/withBillingActions';
import withSubscriptionsActions from 'containers/Subscriptions/withSubscriptionsActions';

import { compose } from 'utils';

/**
 * Payment via license dialog content.
 */
function PaymentViaLicenseDialogContent({
  // #ownProps
  subscriptionForm,

  // #withDialog
  closeDialog,

  // #withBillingActions
  requestSubmitBilling,

  // #withSubscriptionsActions
  requestFetchSubscriptions,
}) {
  const { formatMessage } = useIntl();
  const history = useHistory();

  // Handle submit.
  const handleSubmit = (values, { setSubmitting }) => {
    setSubmitting(true);

    requestSubmitBilling({ ...values, ...subscriptionForm })
      .then(() => {
        return requestFetchSubscriptions();
      })
      .then(() => {
        return closeDialog('payment-via-voucher');
      })
      .then(() => {
        history.push('initializing');
      })
      .finally((errors) => {
        setSubmitting(false);
      });
  };

  // Initial values.
  const initialValues = {
    license_number: '',
    plan_slug: '',
    period: '',
  };
  // Validation schema.
  const validationSchema = Yup.object().shape({
    license_number: Yup.string()
      .required()
      .min(10)
      .max(10)
      .label(formatMessage({ id: 'license_number' })),
  });

  return (
    <DialogContent>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        component={PaymentViaLicenseForm}
      />
    </DialogContent>
  );
}

export default compose(
  withDialogActions,
  withBillingActions,
  withSubscriptionsActions,
)(PaymentViaLicenseDialogContent);
