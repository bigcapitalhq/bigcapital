// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Formik } from 'formik';
import { Intent } from '@blueprintjs/core';
import { defaultTo, omit } from 'lodash';

import { AppToaster } from '@/components';
import { useQuickPaymentReceiveContext } from './QuickPaymentReceiveFormProvider';
import { CreateQuickPaymentReceiveFormSchema } from './QuickPaymentReceive.schema';
import QuickPaymentReceiveFormContent from './QuickPaymentReceiveFormContent';

import withSettings from '@/containers/Settings/withSettings';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import {
  defaultInitialValues,
  transformErrors,
  transformInvoiceToForm,
} from './utils';
import { compose, transactionNumber } from '@/utils';

/**
 * Quick payment receive form.
 */
function QuickPaymentReceiveForm({
  // #withDialogActions
  closeDialog,

  // #withSettings
  paymentReceiveAutoIncrement,
  paymentReceiveNumberPrefix,
  paymentReceiveNextNumber,
  preferredDepositAccount,
}) {
  const { dialogName, invoice, createPaymentReceiveMutate } =
    useQuickPaymentReceiveContext();

  // Payment receive number.
  const nextPaymentNumber = transactionNumber(
    paymentReceiveNumberPrefix,
    paymentReceiveNextNumber,
  );

  // Initial form values
  const initialValues = {
    ...defaultInitialValues,
    ...(paymentReceiveAutoIncrement && {
      payment_receive_no: nextPaymentNumber,
    }),
    deposit_account_id: defaultTo(preferredDepositAccount, ''),
    ...transformInvoiceToForm(invoice),
  };

  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting, setFieldError }) => {
    const entries = [
      {
        invoice_id: values.invoice_id,
        payment_amount: values.amount,
      },
    ];
    const form = {
      ...omit(values, ['payment_receive_no', 'invoice_id']),
      ...(!paymentReceiveAutoIncrement && {
        payment_receive_no: values.payment_receive_no,
      }),
      entries,
    };

    // Handle request response success.
    const onSaved = (response) => {
      AppToaster.show({
        message: intl.get('the_payment_received_transaction_has_been_created'),
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
      if (errors) {
        transformErrors(errors, { setFieldError });
      }
      setSubmitting(false);
    };
    createPaymentReceiveMutate(form).then(onSaved).catch(onError);
  };

  return (
    <Formik
      validationSchema={CreateQuickPaymentReceiveFormSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={QuickPaymentReceiveFormContent}
    />
  );
}

export default compose(
  withDialogActions,
  withSettings(({ paymentReceiveSettings }) => ({
    paymentReceiveNextNumber: paymentReceiveSettings?.nextNumber,
    paymentReceiveNumberPrefix: paymentReceiveSettings?.numberPrefix,
    paymentReceiveAutoIncrement: paymentReceiveSettings?.autoIncrement,
    preferredDepositAccount: paymentReceiveSettings?.preferredDepositAccount,
  })),
)(QuickPaymentReceiveForm);
