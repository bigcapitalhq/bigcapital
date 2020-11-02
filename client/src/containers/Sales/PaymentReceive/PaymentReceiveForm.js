import React, {
  useMemo,
  useCallback,
  useEffect,
  useState,
  useRef,
} from 'react';

import * as Yup from 'yup';
import { useFormik } from 'formik';
import moment from 'moment';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { pick, sumBy } from 'lodash';
import { Intent, Alert } from '@blueprintjs/core';
import classNames from 'classnames';

import { CLASSES } from 'common/classes';
import PaymentReceiveHeader from './PaymentReceiveFormHeader';
import PaymentReceiveItemsTable from './PaymentReceiveItemsTable';
import PaymentReceiveFloatingActions from './PaymentReceiveFloatingActions';

import withMediaActions from 'containers/Media/withMediaActions';
import withPaymentReceivesActions from './withPaymentReceivesActions';
import withPaymentReceiveDetail from './withPaymentReceiveDetail';
import { AppToaster } from 'components';

import { compose } from 'utils';

function PaymentReceiveForm({
  // #ownProps
  paymentReceiveId,

  //#WithPaymentReceiveActions
  requestSubmitPaymentReceive,
  requestEditPaymentReceive,

  // #withPaymentReceive
  paymentReceive,
}) {
  const [amountChangeAlert, setAmountChangeAlert] = useState(false);
  const [clearLinesAlert, setClearLinesAlert] = useState(false);
  const [fullAmount, setFullAmount] = useState(null);

  const { formatMessage } = useIntl();

  // Form validation schema.
  const validationSchema = Yup.object().shape({
    customer_id: Yup.string()
      .label(formatMessage({ id: 'customer_name_' }))
      .required(),
    payment_date: Yup.date()
      .required()
      .label(formatMessage({ id: 'payment_date_' })),
    deposit_account_id: Yup.number()
      .required()
      .label(formatMessage({ id: 'deposit_account_' })),
    full_amount: Yup.number().nullable(),
    payment_receive_no: Yup.number()
      .required()
      .label(formatMessage({ id: 'payment_receive_no_' })),
    reference_no: Yup.string().min(1).max(255).nullable(),
    description: Yup.string().nullable(),
    entries: Yup.array().of(
      Yup.object().shape({
        id: Yup.number().nullable(),
        due_amount: Yup.number().nullable(),
        payment_amount: Yup.number().nullable().max(Yup.ref('due_amount')),
        invoice_id: Yup.number()
          .nullable()
          .when(['payment_amount'], {
            is: (payment_amount) => payment_amount,
            then: Yup.number().required(),
          }),
      }),
    ),
  });
  // Default payment receive.
  const defaultPaymentReceive = useMemo(
    () => ({
      invoice_id: '',
      invoice_date: moment(new Date()).format('YYYY-MM-DD'),
      invoice_no: '',
      balance: '',
      due_amount: '',
      payment_amount: '',
    }),
    [],
  );
  const defaultPaymentReceiveEntry = {
    id: null,
    payment_amount: null,
    invoice_id: null,
  };
  // Form initial values.
  const defaultInitialValues = useMemo(
    () => ({
      customer_id: '',
      deposit_account_id: '',
      payment_date: moment(new Date()).format('YYYY-MM-DD'),
      reference_no: '',
      payment_receive_no: '',
      description: '',
      entries: [],
    }),
    [],
  );

  // Form initial values.
  const initialValues = useMemo(
    () => ({
      ...(paymentReceive
        ? {
            ...pick(paymentReceive, Object.keys(defaultInitialValues)),
            entries: [
              ...paymentReceive.entries.map((paymentReceive) => ({
                ...pick(paymentReceive, Object.keys(defaultPaymentReceive)),
              })),
            ],
          }
        : {
            ...defaultInitialValues,
          }),
    }),
    [paymentReceive, defaultInitialValues, defaultPaymentReceive],
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
        ...pick(entry, Object.keys(defaultPaymentReceiveEntry)),
      }));

    // Calculates the total payment amount of entries.
    const totalPaymentAmount = sumBy(entries, 'payment_amount');

    if (totalPaymentAmount <= 0) {
      AppToaster.show({
        message: formatMessage({
          id: 'you_cannot_make_payment_with_zero_total_amount',
          intent: Intent.WARNING,
        }),
      });
      return;
    }
    const form = { ...values, entries };

    // Handle request response success.
    const onSaved = (response) => {
      AppToaster.show({
        message: formatMessage({
          id: paymentReceiveId
            ? 'the_payment_has_been_received_successfully_edited'
            : 'the_payment_has_been_received_successfully_created',
        }),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);
      resetForm();
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
  } = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: {
      ...initialValues,
    },
    onSubmit: handleSubmitForm,
  });

  // Handle update data.
  const handleUpdataData = useCallback(
    (entries) => {
      setFieldValue('entries', entries);
    },
    [setFieldValue],
  );

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
  // Handle confirm clear all lines.
  const handleConfirmClearLines = useCallback(() => {
    setFieldValue(
      'entries',
      values.entries.map((entry) => ({
        ...entry,
        payment_amount: 0,
      })),
    );
    setClearLinesAlert(false);
  }, [setFieldValue, setClearLinesAlert, values.entries]);

  return (
    <div className={classNames(
      CLASSES.PAGE_FORM, CLASSES.PAGE_FORM_PAYMENT_RECEIVE
    )}>
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
        />
        <PaymentReceiveItemsTable
          paymentReceiveId={paymentReceiveId}
          customerId={values.customer_id}
          fullAmount={fullAmount}
          onUpdateData={handleUpdataData}
          paymentEntries={values.entries}
          errors={errors?.entries}
          onClickClearAllLines={handleClearAllLines}
        />
        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={<T id={'ok'} />}
          intent={Intent.WARNING}
          isOpen={amountChangeAlert}
          onCancel={handleCancelAmountChangeAlert}
          onConfirm={handleConfirmAmountChangeAlert}
        >
          <p>Are you sure to discard full amount?</p>
        </Alert>
        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={<T id={'ok'} />}
          intent={Intent.WARNING}
          isOpen={clearLinesAlert}
          onCancel={handleCancelClearLines}
          onConfirm={handleConfirmClearLines}
        >
          <p>Are you sure to discard full amount?</p>
        </Alert>

        <PaymentReceiveFloatingActions
          isSubmitting={isSubmitting}
          paymentReceiveId={paymentReceiveId}
        />
      </form>
    </div>
  );
}

export default compose(
  withPaymentReceivesActions,
  withMediaActions,
  // withPaymentReceives(({ paymentReceivesItems }) => ({
  //   paymentReceivesItems,
  // })),
  withPaymentReceiveDetail(({ paymentReceive }) => ({
    paymentReceive,
  })),
)(PaymentReceiveForm);
