// @ts-nocheck
import React, { useMemo } from 'react';
import { isEmpty, defaultTo } from 'lodash';
import intl from 'react-intl-universal';
import classNames from 'classnames';
import { Formik, Form } from 'formik';
import { useHistory } from 'react-router-dom';
import { Intent } from '@blueprintjs/core';

import '@/style/pages/PaymentReceive/PageForm.scss';

import { CLASSES } from '@/constants/classes';
import PaymentReceiveHeader from './PaymentReceiveFormHeader';
import PaymentReceiveFormBody from './PaymentReceiveFormBody';
import PaymentReceiveFloatingActions from './PaymentReceiveFloatingActions';
import PaymentReceiveFormFooter from './PaymentReceiveFormFooter';
import PaymentReceiveFormAlerts from './PaymentReceiveFormAlerts';
import PaymentReceiveFormDialogs from './PaymentReceiveFormDialogs';
import PaymentReceiveFormTopBar from './PaymentReceiveFormTopBar';
import { PaymentReceiveInnerProvider } from './PaymentReceiveInnerProvider';

import withSettings from '@/containers/Settings/withSettings';
import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';
import withDialogActions from '@/containers/Dialog/withDialogActions';

import {
  EditPaymentReceiveFormSchema,
  CreatePaymentReceiveFormSchema,
} from './PaymentReceiveForm.schema';
import { AppToaster } from '@/components';
import { transactionNumber, compose } from '@/utils';

import { usePaymentReceiveFormContext } from './PaymentReceiveFormProvider';
import {
  defaultPaymentReceive,
  transformToEditForm,
  transformFormToRequest,
  transformErrors,
  resetFormState,
  getExceededAmountFromValues,
} from './utils';
import { PaymentReceiveSyncIncrementSettingsToForm } from './components';

/**
 * Payment Receive form.
 */
function PaymentReceiveForm({
  // #withSettings
  preferredDepositAccount,
  paymentReceiveNextNumber,
  paymentReceiveNumberPrefix,
  paymentReceiveAutoIncrement,

  // #withCurrentOrganization
  organization: { base_currency },

  // #withDialogActions
  openDialog,
}) {
  const history = useHistory();

  // Payment receive form context.
  const {
    isNewMode,
    paymentReceiveEditPage,
    paymentEntriesEditPage,
    paymentReceiveId,
    submitPayload,
    editPaymentReceiveMutate,
    createPaymentReceiveMutate,
    isExcessConfirmed,
  } = usePaymentReceiveFormContext();

  // Payment receive number.
  const nextPaymentNumber = transactionNumber(
    paymentReceiveNumberPrefix,
    paymentReceiveNextNumber,
  );
  // Form initial values.
  const initialValues = useMemo(
    () => ({
      ...(!isEmpty(paymentReceiveEditPage)
        ? transformToEditForm(paymentReceiveEditPage, paymentEntriesEditPage)
        : {
            ...defaultPaymentReceive,
            // If the auto-increment mode is enabled, take the next payment
            // number from the settings.
            ...(paymentReceiveAutoIncrement && {
              payment_receive_no: nextPaymentNumber,
            }),
            deposit_account_id: defaultTo(preferredDepositAccount, ''),
            currency_code: base_currency,
          }),
    }),
    [
      paymentReceiveEditPage,
      nextPaymentNumber,
      paymentEntriesEditPage,
      paymentReceiveAutoIncrement,
      preferredDepositAccount,
    ],
  );
  // Handle form submit.
  const handleSubmitForm = (
    values,
    { setSubmitting, resetForm, setFieldError },
  ) => {
    setSubmitting(true);
    const exceededAmount = getExceededAmountFromValues(values);

    // Validates the amount should be bigger than zero.
    if (values.amount <= 0) {
      AppToaster.show({
        message: intl.get('you_cannot_make_payment_with_zero_total_amount'),
        intent: Intent.DANGER,
      });
      setSubmitting(false);
      return;
    }
    // Show the confirm popup if the excessed amount bigger than zero and
    // excess confirmation has not been confirmed yet.
    if (exceededAmount > 0 && !isExcessConfirmed) {
      setSubmitting(false);
      openDialog('payment-received-excessed-payment');
      return;
    }
    // Transformes the form values to request body.
    const form = transformFormToRequest(values);

    // Handle request response success.
    const onSaved = () => {
      setSubmitting(false);
      AppToaster.show({
        message: intl.get(
          paymentReceiveId
            ? 'the_payment_received_transaction_has_been_edited'
            : 'the_payment_received_transaction_has_been_created',
        ),
        intent: Intent.SUCCESS,
      });

      if (submitPayload.redirect) {
        history.push('/payments-received');
      }
      if (submitPayload.resetForm) {
        resetFormState({ resetForm, initialValues, values });
      }
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

    if (paymentReceiveId) {
      return editPaymentReceiveMutate([paymentReceiveId, form])
        .then(onSaved)
        .catch(onError);
    } else {
      return createPaymentReceiveMutate(form).then(onSaved).catch(onError);
    }
  };
  return (
    <div
      className={classNames(
        CLASSES.PAGE_FORM,
        CLASSES.PAGE_FORM_STRIP_STYLE,
        CLASSES.PAGE_FORM_PAYMENT_RECEIVE,
      )}
    >
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmitForm}
        validationSchema={
          isNewMode
            ? CreatePaymentReceiveFormSchema
            : EditPaymentReceiveFormSchema
        }
      >
        <Form>
          <PaymentReceiveInnerProvider>
            <PaymentReceiveFormTopBar />
            <PaymentReceiveHeader />
            <PaymentReceiveFormBody />
            <PaymentReceiveFormFooter />
            <PaymentReceiveFloatingActions />

            {/* ------- Effects ------- */}
            <PaymentReceiveSyncIncrementSettingsToForm />

            {/* ------- Alerts & Dialogs ------- */}
            <PaymentReceiveFormAlerts />
            <PaymentReceiveFormDialogs />
          </PaymentReceiveInnerProvider>
        </Form>
      </Formik>
    </div>
  );
}

export default compose(
  withSettings(({ paymentReceiveSettings }) => ({
    paymentReceiveSettings,
    paymentReceiveNextNumber: paymentReceiveSettings?.nextNumber,
    paymentReceiveNumberPrefix: paymentReceiveSettings?.numberPrefix,
    paymentReceiveAutoIncrement: paymentReceiveSettings?.autoIncrement,
    preferredDepositAccount: paymentReceiveSettings?.preferredDepositAccount,
  })),
  withCurrentOrganization(),
  withDialogActions,
)(PaymentReceiveForm);
