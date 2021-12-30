import React, { useMemo } from 'react';
import { Formik, Form } from 'formik';
import intl from 'react-intl-universal';
import { omit, sumBy, pick, isEmpty, defaultTo } from 'lodash';
import { Intent } from '@blueprintjs/core';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';

import 'style/pages/PaymentReceive/PageForm.scss';

import { CLASSES } from 'common/classes';
import PaymentReceiveHeader from './PaymentReceiveFormHeader';
import PaymentReceiveFormBody from './PaymentReceiveFormBody';
import PaymentReceiveFloatingActions from './PaymentReceiveFloatingActions';
import PaymentReceiveFormFooter from './PaymentReceiveFormFooter';
import PaymentReceiveFormAlerts from './PaymentReceiveFormAlerts';
import PaymentReceiveFormDialogs from './PaymentReceiveFormDialogs';
import { PaymentReceiveInnerProvider } from './PaymentReceiveInnerProvider';

import withSettings from 'containers/Settings/withSettings';
import withCurrentOrganization from 'containers/Organization/withCurrentOrganization';

import {
  EditPaymentReceiveFormSchema,
  CreatePaymentReceiveFormSchema,
} from './PaymentReceiveForm.schema';
import { AppToaster } from 'components';
import { transactionNumber, compose } from 'utils';

import { usePaymentReceiveFormContext } from './PaymentReceiveFormProvider';
import {
  defaultPaymentReceive,
  transformToEditForm,
  transformFormToRequest,
} from './utils';

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
            ...(paymentReceiveAutoIncrement && {
              payment_receive_no: nextPaymentNumber,
              deposit_account_id: defaultTo(preferredDepositAccount, ''),
            }),
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

    // Calculates the total payment amount of entries.
    const totalPaymentAmount = sumBy(values.entries, 'payment_amount');

    if (totalPaymentAmount <= 0) {
      AppToaster.show({
        message: intl.get('you_cannot_make_payment_with_zero_total_amount'),
        intent: Intent.DANGER,
      });
      return;
    }
    // Transformes the form values to request body.
    const form = transformFormToRequest(values);

    // Handle request response success.
    const onSaved = (response) => {
      AppToaster.show({
        message: intl.get(
          paymentReceiveId
            ? 'the_payment_receive_transaction_has_been_edited'
            : 'the_payment_receive_transaction_has_been_created',
        ),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);

      if (submitPayload.redirect) {
        history.push('/payment-receives');
      }
      if (submitPayload.resetForm) {
        resetForm();
      }
    };
    // Handle request response errors.
    const onError = ({
      response: {
        data: { errors },
      },
    }) => {
      const getError = (errorType) => errors.find((e) => e.type === errorType);

      if (getError('PAYMENT_RECEIVE_NO_EXISTS')) {
        setFieldError(
          'payment_receive_no',
          intl.get('payment_number_is_not_unique'),
        );
      }
      if (getError('PAYMENT_RECEIVE_NO_REQUIRED')) {
        setFieldError(
          'payment_receive_no',
          intl.get('payment_receive.field.error.payment_receive_no_required'),
        );
      }
      setSubmitting(false);
    };

    if (paymentReceiveId) {
      editPaymentReceiveMutate([paymentReceiveId, form])
        .then(onSaved)
        .catch(onError);
    } else {
      createPaymentReceiveMutate(form).then(onSaved).catch(onError);
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
            <PaymentReceiveHeader />
            <PaymentReceiveFormBody />
            <PaymentReceiveFormFooter />
            <PaymentReceiveFloatingActions />

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
)(PaymentReceiveForm);
