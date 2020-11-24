import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import moment from 'moment';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { pick, sumBy, omit } from 'lodash';
import { Intent, Alert } from '@blueprintjs/core';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';

import { CLASSES } from 'common/classes';
import PaymentReceiveHeader from './PaymentReceiveFormHeader';
import PaymentReceiveItemsTable from './PaymentReceiveItemsTable';
import PaymentReceiveFloatingActions from './PaymentReceiveFloatingActions';
import PaymentReceiveFormFooter from './PaymentReceiveFormFooter';

import withMediaActions from 'containers/Media/withMediaActions';
import withPaymentReceivesActions from './withPaymentReceivesActions';
import withPaymentReceiveDetail from './withPaymentReceiveDetail';
import withPaymentReceives from './withPaymentReceives';
import withSettings from 'containers/Settings/withSettings';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import {
  EditPaymentReceiveFormSchema,
  CreatePaymentReceiveFormSchema,
} from './PaymentReceiveForm.schema';
import { AppToaster } from 'components';

import { compose, defaultToTransform } from 'utils';

/**
 * Payment Receive form.
 */
function PaymentReceiveForm({
  // #ownProps
  paymentReceiveId,
  mode, //edit, new

  //#WithPaymentReceiveActions
  requestSubmitPaymentReceive,
  requestEditPaymentReceive,
  setPaymentReceiveNumberChanged,

  // #withPaymentReceiveDetail
  paymentReceive,
  paymentReceiveEntries,

  // #withSettings
  paymentReceiveNextNumber,
  paymentReceiveNumberPrefix,

  // #withPaymentReceives
  paymentReceiveNumberChanged,

  // #withDashboardAction
  changePageTitle,
  changePageSubtitle,
}) {
  const history = useHistory();

  const [amountChangeAlert, setAmountChangeAlert] = useState(false);
  const [clearLinesAlert, setClearLinesAlert] = useState(false);
  const [fullAmount, setFullAmount] = useState(null);
  const [clearFormAlert, setClearFormAlert] = useState(false);

  const { formatMessage } = useIntl();
  const [localPaymentEntries, setLocalPaymentEntries] = useState(
    paymentReceiveEntries,
  );
  const isNewMode = !paymentReceiveId;

  const paymentReceiveNumber = paymentReceiveNumberPrefix
    ? `${paymentReceiveNumberPrefix}-${paymentReceiveNextNumber}`
    : paymentReceiveNextNumber;

  useEffect(() => {
    const transactionNumber = !isNewMode
      ? paymentReceive.payment_receive_no
      : paymentReceiveNumber;

    if (paymentReceive && paymentReceiveId) {
      changePageTitle(formatMessage({ id: 'edit_payment_receive' }));
      changePageSubtitle(`No. ${paymentReceive.payment_receive_no}`);
    } else {
      changePageTitle(formatMessage({ id: 'payment_receive' }));
    }
    changePageSubtitle(
      defaultToTransform(transactionNumber, `No. ${transactionNumber}`, ''),
    );
  }, [
    isNewMode,
    changePageTitle,
    changePageSubtitle,
    paymentReceive,
    paymentReceiveId,
    formatMessage,
    paymentReceiveNumber,
  ]);

  useEffect(() => {
    if (localPaymentEntries !== paymentReceiveEntries) {
      setLocalPaymentEntries(paymentReceiveEntries);
    }
  }, [localPaymentEntries, paymentReceiveEntries]);

  // Form validation schema.
  const validationSchema = isNewMode
    ? CreatePaymentReceiveFormSchema
    : EditPaymentReceiveFormSchema;

  // Default payment receive entry.
  const defaultPaymentReceiveEntry = {
    id: null,
    payment_amount: null,
    invoice_id: null,
    due_amount: null,
  };

  // Form initial values.
  const defaultInitialValues = {
    customer_id: '',
    deposit_account_id: '',
    payment_date: moment(new Date()).format('YYYY-MM-DD'),
    reference_no: '',
    payment_receive_no: paymentReceiveNumber,
    description: '',
    full_amount: '',
    entries: [],
  };

  // Form initial values.
  const initialValues = useMemo(
    () => ({
      ...(paymentReceive
        ? {
            ...pick(paymentReceive, Object.keys(defaultInitialValues)),
            entries: [
              ...paymentReceiveEntries.map((paymentReceiveEntry) => ({
                ...pick(
                  paymentReceiveEntry,
                  Object.keys(defaultPaymentReceiveEntry),
                ),
              })),
            ],
          }
        : {
            ...defaultInitialValues,
          }),
    }),
    [paymentReceive, paymentReceiveEntries],
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
        ...omit(entry, ['due_amount']),
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
      resetForm();
      history.push('/payment-receives');
    };
    // Handle request response errors.
    const onError = (errors) => {
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
      requestEditPaymentReceive(paymentReceiveId, form)
        .then(onSaved)
        .catch(onError);
    } else {
      requestSubmitPaymentReceive(form).then(onSaved).catch(onError);
    }
  };

  const {
    errors,
    values,
    setFieldValue,
    getFieldProps,
    setValues,
    handleSubmit,
    isSubmitting,
    touched,
    resetForm,
  } = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: {
      ...initialValues,
    },
    onSubmit: handleSubmitForm,
  });

  const transformDataTableToEntries = (dataTable) => {
    return dataTable.map((data) => ({
      ...pick(data, Object.keys(defaultPaymentReceiveEntry)),
    }));
  };

  // Handle update data.
  const handleUpdataData = useCallback(
    (entries) => {
      setFieldValue('entries', transformDataTableToEntries(entries));
    },
    [setFieldValue],
  );

  // Handle fetch success of customer invoices entries.
  const handleFetchEntriesSuccess = useCallback(
    (entries) => {
      setFieldValue('entries', transformDataTableToEntries(entries));
    },
    [setFieldValue],
  );

  // Handles full amount change.
  const handleFullAmountChange = useCallback(
    (value) => {
      if (value !== fullAmount) {
        setAmountChangeAlert(value);
      }
    },
    [fullAmount, setAmountChangeAlert],
  );

  // Handle clear all lines button click.
  const handleClearAllLines = useCallback(() => {
    setClearLinesAlert(true);
  }, [setClearLinesAlert]);

  // Handle cancel button click of clear lines alert
  const handleCancelClearLines = useCallback(() => {
    setClearLinesAlert(false);
  }, [setClearLinesAlert]);

  // Handle cancel button of amount change alert.
  const handleCancelAmountChangeAlert = () => {
    setAmountChangeAlert(false);
  };
  // Handle confirm button of amount change alert.
  const handleConfirmAmountChangeAlert = () => {
    setFullAmount(amountChangeAlert);
    setAmountChangeAlert(false);
  };

  // Reset entries payment amount.
  const resetEntriesPaymentAmount = (entries) => {
    return entries.map((entry) => ({ ...entry, payment_amount: 0 }));
  };
  // Handle confirm clear all lines.
  const handleConfirmClearLines = useCallback(() => {
    setLocalPaymentEntries(resetEntriesPaymentAmount(localPaymentEntries));
    setFieldValue('entries', resetEntriesPaymentAmount(values.entries));
    setClearLinesAlert(false);
  }, [setFieldValue, setClearLinesAlert, values.entries, localPaymentEntries]);

  // Handle footer clear button click.
  const handleClearBtnClick = () => {
    setClearFormAlert(true);
  };
  // Handle cancel button click of clear form alert.
  const handleCancelClearFormAlert = () => {
    setClearFormAlert(false);
  };
  // Handle confirm button click of clear form alert.
  const handleConfirmCancelClearFormAlert = () => {
    resetForm();
    setClearFormAlert(false);
    setFullAmount(null);
  };

  // Calculates the total receivable amount from due amount.
  const receivableFullAmount = useMemo(
    () => sumBy(values.entries, 'due_amount'),
    [values.entries],
  );

  const fullAmountReceived = useMemo(
    () => sumBy(values.entries, 'payment_amount'),
    [values.entries],
  );

  useEffect(() => {
    if (paymentReceiveNumberChanged) {
      setFieldValue('payment_receive_no', paymentReceiveNumber);
      changePageSubtitle(
        defaultToTransform(
          paymentReceiveNumber,
          `No. ${paymentReceiveNumber}`,
          '',
        ),
      );
      setPaymentReceiveNumberChanged(false);
    }
  }, [
    paymentReceiveNumber,
    paymentReceiveNumberChanged,
    setFieldValue,
    changePageSubtitle,
    setPaymentReceiveNumberChanged,
  ]);

  const handlePaymentReceiveNumberChanged = useCallback(
    (payment_receive_no) => {
      changePageSubtitle(
        defaultToTransform(payment_receive_no, `No.${payment_receive_no}`, ''),
      );
    },
    [changePageSubtitle],
  );

  return (
    <div
      className={classNames(
        CLASSES.PAGE_FORM,
        CLASSES.PAGE_FORM_PAYMENT_RECEIVE,
      )}
    >
      <form onSubmit={handleSubmit}>
        <PaymentReceiveHeader
          errors={errors}
          touched={touched}
          setFieldValue={setFieldValue}
          getFieldProps={getFieldProps}
          values={values}
          paymentReceiveId={paymentReceiveId}
          customerId={values.customer_id}
          onFullAmountChanged={handleFullAmountChange}
          receivableFullAmount={receivableFullAmount}
          amountReceived={fullAmountReceived}
          onPaymentReceiveNumberChanged={handlePaymentReceiveNumberChanged}
        />
        <PaymentReceiveItemsTable
          paymentReceiveId={paymentReceiveId}
          customerId={values.customer_id}
          fullAmount={fullAmount}
          onUpdateData={handleUpdataData}
          paymentReceiveEntries={localPaymentEntries}
          errors={errors?.entries}
          onClickClearAllLines={handleClearAllLines}
          onFetchEntriesSuccess={handleFetchEntriesSuccess}
        />
        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={<T id={'ok'} />}
          intent={Intent.WARNING}
          isOpen={amountChangeAlert}
          onCancel={handleCancelAmountChangeAlert}
          onConfirm={handleConfirmAmountChangeAlert}
        >
          <p>
            <T
              id={'changing_full_amount_will_change_all_credits_and_payment'}
            />
          </p>
        </Alert>

        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={<T id={'ok'} />}
          intent={Intent.WARNING}
          isOpen={clearLinesAlert}
          onCancel={handleCancelClearLines}
          onConfirm={handleConfirmClearLines}
        >
          <p>
            <T id={'clearing_the_table_lines_will_delete_all_credits'} />
          </p>
        </Alert>

        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={<T id={'ok'} />}
          intent={Intent.WARNING}
          isOpen={clearFormAlert}
          onCancel={handleCancelClearFormAlert}
          onConfirm={handleConfirmCancelClearFormAlert}
        >
          <p>
            <T id={'are_you_sure_you_want_to_clear_this_transaction'} />
          </p>
        </Alert>

        <PaymentReceiveFormFooter getFieldProps={getFieldProps} />

        <PaymentReceiveFloatingActions
          isSubmitting={isSubmitting}
          paymentReceiveId={paymentReceiveId}
          onClearClick={handleClearBtnClick}
        />
      </form>
    </div>
  );
}

export default compose(
  withPaymentReceivesActions,
  withDashboardActions,
  withMediaActions,
  withPaymentReceiveDetail(({ paymentReceive, paymentReceiveEntries }) => ({
    paymentReceive,
    paymentReceiveEntries,
  })),
  withSettings(({ paymentReceiveSettings }) => ({
    paymentReceiveNextNumber: paymentReceiveSettings?.nextNumber,
    paymentReceiveNumberPrefix: paymentReceiveSettings?.numberPrefix,
  })),
  withPaymentReceives(({ paymentReceiveNumberChanged }) => ({
    paymentReceiveNumberChanged,
  })),
)(PaymentReceiveForm);
