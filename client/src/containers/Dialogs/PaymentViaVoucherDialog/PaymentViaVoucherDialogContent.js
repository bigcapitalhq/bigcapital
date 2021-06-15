import React from 'react';
import { Formik } from 'formik';

import intl from 'react-intl-universal';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import Toaster from 'components/AppToaster';

import 'style/pages/Setup/PaymentViaVoucherDialog.scss';

import { usePaymentByVoucher } from 'hooks/query';
import { DialogContent } from 'components';
import PaymentViaLicenseForm from './PaymentViaVoucherForm';

import withDialogActions from 'containers/Dialog/withDialogActions';
import { compose } from 'utils';
import { Intent } from '@blueprintjs/core';

/**
 * Payment via license dialog content.
 */
function PaymentViaLicenseDialogContent({
  // #ownProps
  subscriptionForm,

  // #withDialog
  closeDialog,
}) {
  const history = useHistory();

  // Payment via voucher
  const { mutateAsync: paymentViaVoucherMutate } = usePaymentByVoucher();

  // Handle submit.
  const handleSubmit = (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);

    paymentViaVoucherMutate({ ...values })
      .then(() => {
        Toaster.show({
          message: intl.get('payment_has_been_done_successfully'),
          intent: Intent.SUCCESS,
        });
        return closeDialog('payment-via-voucher');
      })
      .then(() => {
        history.push('initializing');
      })
      .catch(
        ({
          response: {
            data: { errors },
          },
        }) => {
          if (errors.find((e) => e.type === 'LICENSE.CODE.IS.INVALID')) {
            setErrors({
              license_code: 'The license code is not valid, please try agin.',
            });
          }
        },
      )
      .finally((errors) => {
        setSubmitting(false);
      });
  };

  // Initial values.
  const initialValues = {
    license_code: '',
    plan_slug: '',
    period: '',
    ...subscriptionForm,
  };
  // Validation schema.
  const validationSchema = Yup.object().shape({
    license_code: Yup.string()
      .required()
      .min(10)
      .max(10)
      .label(intl.get('license_code')),
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

export default compose(withDialogActions)(PaymentViaLicenseDialogContent);
