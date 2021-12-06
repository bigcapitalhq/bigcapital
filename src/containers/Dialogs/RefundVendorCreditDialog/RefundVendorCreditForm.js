import React from 'react';
import { Formik } from 'formik';
import { Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import moment from 'moment';
import { omit, defaultTo } from 'lodash';

import { AppToaster } from 'components';
import { useRefundVendorCreditContext } from './RefundVendorCreditFormProvider';
import { CreateVendorRefundCreditFormSchema } from './RefundVendorCreditForm.schema';
import RefundVendorCreditFormContent from './RefundVendorCreditFormContent';

import withSettings from 'containers/Settings/withSettings';
import withDialogActions from 'containers/Dialog/withDialogActions';
import { compose, transactionNumber } from 'utils';

const defaultInitialValues = {
  deposit_account_id: '',
  date: moment(new Date()).format('YYYY-MM-DD'),
  reference_no: '',
  description: '',
  amount: '',
};

/**
 * Refund Vendor credit form.
 */
function RefundVendorCreditForm({
  // #withDialogActions
  closeDialog,
}) {
  const { vendorCredit, dialogName, createRefundVendorCreditMutate } =
    useRefundVendorCreditContext();

  // Initial form values
  const initialValues = {
    ...defaultInitialValues,
    ...vendorCredit,
  };

  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting, setFieldError }) => {
    const form = {
      ...omit(values, ['currency_code', 'credits_remaining']),
    };

    // Handle request response success.
    const onSaved = (response) => {
      AppToaster.show({
        message: intl.get('refund_vendor_credit.dialog.success_message'),
        intent: Intent.SUCCESS,
      });
      closeDialog(dialogName);
    };
    // Handle request response errors.
    const onError = ({
      response: {
        data: { errors },
      },
    }) => {
      setSubmitting(false);
    };

    createRefundVendorCreditMutate([vendorCredit.id, form])
      .then(onSaved)
      .catch(onError);
  };

  return (
    <Formik
      validationSchema={CreateVendorRefundCreditFormSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={RefundVendorCreditFormContent}
    />
  );
}

export default compose(withDialogActions)(RefundVendorCreditForm);
