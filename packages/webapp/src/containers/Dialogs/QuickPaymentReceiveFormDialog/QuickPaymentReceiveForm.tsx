// @ts-nocheck
import { Intent } from '@blueprintjs/core';
import { Formik } from 'formik';
import { defaultTo, omit } from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import { CreateQuickPaymentReceiveFormSchema } from './QuickPaymentReceive.schema';
import { QuickPaymentReceiveFormContent } from './QuickPaymentReceiveFormContent';
import { useQuickPaymentReceiveContext } from './QuickPaymentReceiveFormProvider';
import {
  defaultInitialValues,
  transformErrors,
  transformInvoiceToForm,
} from './utils';
import { AppToaster } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose, transactionNumber } from '@/utils';

/**
 * Quick payment receive form.
 */
function QuickPaymentReceiveFormInner({
  // #withDialogActions
  closeDialog,
}) {
  const {
    dialogName,
    invoice,
    createPaymentReceiveMutate,
    paymentReceiveSettings,
  } = useQuickPaymentReceiveContext();

  const paymentReceiveNextNumber = paymentReceiveSettings?.nextNumber as
    | number
    | undefined;
  const paymentReceiveNumberPrefix = paymentReceiveSettings?.numberPrefix as
    | string
    | undefined;
  const paymentReceiveAutoIncrement = paymentReceiveSettings?.autoIncrement as
    | boolean
    | undefined;
  const preferredDepositAccount =
    paymentReceiveSettings?.preferredDepositAccount as
      | string
      | number
      | undefined;

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
    const onError = ({ data: { errors } }) => {
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

export const QuickPaymentReceiveForm = compose(withDialogActions)(
  QuickPaymentReceiveFormInner,
);
