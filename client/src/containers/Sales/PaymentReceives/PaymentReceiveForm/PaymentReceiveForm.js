import React, { useMemo } from 'react';
import { Formik, Form } from 'formik';
import { useIntl } from 'react-intl';
import { sumBy, pick, isEmpty } from 'lodash';
import { Intent } from '@blueprintjs/core';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';

import { CLASSES } from 'common/classes';
import PaymentReceiveHeader from './PaymentReceiveFormHeader';
import PaymentReceiveFormBody from './PaymentReceiveFormBody';
import PaymentReceiveFloatingActions from './PaymentReceiveFloatingActions';
import PaymentReceiveFormFooter from './PaymentReceiveFormFooter';
import PaymentReceiveFormAlerts from './PaymentReceiveFormAlerts';
import PaymentReceiveFormDialogs from './PaymentReceiveFormDialogs';
import { PaymentReceiveInnerProvider } from './PaymentReceiveInnerProvider';

import withSettings from 'containers/Settings/withSettings';
import {
  EditPaymentReceiveFormSchema,
  CreatePaymentReceiveFormSchema,
} from './PaymentReceiveForm.schema';
import { AppToaster } from 'components';
import { compose } from 'utils';

import { usePaymentReceiveFormContext } from './PaymentReceiveFormProvider';
import {
  defaultPaymentReceive,
  transformToEditForm,
} from './utils';

import 'style/pages/PaymentReceive/PageForm.scss';

/**
 * Payment Receive form.
 */
function PaymentReceiveForm({
  // #withSettings
  paymentReceiveNextNumber,
  paymentReceiveNumberPrefix,
}) {
  const history = useHistory();
  const { formatMessage } = useIntl();

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
  const paymentReceiveNumber = paymentReceiveNumberPrefix
    ? `${paymentReceiveNumberPrefix}-${paymentReceiveNextNumber}`
    : paymentReceiveNextNumber;

  // Form initial values.
  const initialValues = useMemo(
    () => ({
      ...(!isEmpty(paymentReceiveEditPage)
        ? transformToEditForm(paymentReceiveEditPage, paymentEntriesEditPage)
        : {
            ...defaultPaymentReceive,
            payment_receive_no: paymentReceiveNumber,
          }),
    }),
    [paymentReceiveEditPage, paymentReceiveNumber, paymentEntriesEditPage],
  );

  // Handle form submit.
  const handleSubmitForm = (
    values,
    { setSubmitting, resetForm, setFieldError },
  ) => {
    setSubmitting(true);

    // Filters entries that have no `invoice_id` and `payment_amount`.
    const entries = values.entries
      .filter((entry) => entry.invoice_id && entry.payment_amount)
      .map((entry) => ({
        ...pick(entry, ['invoice_id', 'payment_amount']),
      }));

    // Calculates the total payment amount of entries.
    const totalPaymentAmount = sumBy(entries, 'payment_amount');

    if (totalPaymentAmount <= 0) {
      AppToaster.show({
        message: formatMessage({
          id: 'you_cannot_make_payment_with_zero_total_amount',
        }),
        intent: Intent.DANGER,
      });
      setSubmitting(false);
      return;
    }
    const form = { ...values, entries };

    // Handle request response success.
    const onSaved = (response) => {
      AppToaster.show({
        message: formatMessage({
          id: paymentReceiveId
            ? 'the_payment_receive_transaction_has_been_edited'
            : 'the_payment_receive_transaction_has_been_created',
        }),
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
    const onError = ({ response: { data: { errors } } }) => {
      const getError = (errorType) => errors.find((e) => e.type === errorType);

      if (getError('PAYMENT_RECEIVE_NO_EXISTS')) {
        setFieldError(
          'payment_receive_no',
          formatMessage({ id: 'payment_number_is_not_unique' }),
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

            {/* Alerts & Dialogs */}
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
    paymentReceiveNextNumber: paymentReceiveSettings?.nextNumber,
    paymentReceiveNumberPrefix: paymentReceiveSettings?.numberPrefix,
  })),
)(PaymentReceiveForm);
