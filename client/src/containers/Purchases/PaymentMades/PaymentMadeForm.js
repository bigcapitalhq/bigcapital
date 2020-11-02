import React, { useMemo, useState, useCallback } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import moment from 'moment';
import { Intent, Alert } from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { pick, sumBy } from 'lodash';
import classNames from 'classnames';

import { CLASSES } from 'common/classes';
import PaymentMadeHeader from './PaymentMadeFormHeader';
import PaymentMadeItemsTable from './PaymentMadeItemsTable';
import PaymentMadeFloatingActions from './PaymentMadeFloatingActions';

import withMediaActions from 'containers/Media/withMediaActions';
import withPaymentMadeActions from './withPaymentMadeActions';
import withPaymentMadeDetail from './withPaymentMadeDetail';
import withPaymentMade from './withPaymentMade';
import { AppToaster } from 'components';

import { compose, orderingLinesIndexes } from 'utils';
import withSettings from 'containers/Settings/withSettings';
import { useHistory } from 'react-router-dom';

const ERRORS = {
  PAYMENT_NUMBER_NOT_UNIQUE: 'PAYMENT.NUMBER.NOT.UNIQUE',
};
/**
 * Payment made form component.
 */
function PaymentMadeForm({
  // #withMedia
  requestSubmitMedia,
  requestDeleteMedia,

  // #withPaymentMadesActions
  requestSubmitPaymentMade,
  requestEditPaymentMade,

  // #withPaymentMadeDetail
  paymentMade,

  paymentMadeId,
}) {
  const history = useHistory();
  const { formatMessage } = useIntl();

  const [amountChangeAlert, setAmountChangeAlert] = useState(false);
  const [clearLinesAlert, setClearLinesAlert] = useState(false);
  const [clearFormAlert, setClearFormAlert] = useState(false);
  const [fullAmount, setFullAmount] = useState(null);

  // Yup validation schema.
  const validationSchema = Yup.object().shape({
    vendor_id: Yup.string()
      .label(formatMessage({ id: 'vendor_name_' }))
      .required(),
    payment_date: Yup.date()
      .required()
      .label(formatMessage({ id: 'payment_date_' })),
    payment_account_id: Yup.number()
      .required()
      .label(formatMessage({ id: 'payment_account_' })),
    payment_number: Yup.string()
      .required()
      .label(formatMessage({ id: 'payment_no_' })),
    reference: Yup.string().min(1).max(255).nullable(),
    description: Yup.string(),
    entries: Yup.array().of(
      Yup.object().shape({
        id: Yup.number().nullable(),
        due_amount: Yup.number().nullable(),
        payment_amount: Yup.number().nullable().max(Yup.ref('due_amount')),
        bill_id: Yup.number()
          .nullable()
          .when(['payment_amount'], {
            is: (payment_amount) => payment_amount,
            then: Yup.number().required(),
          }),
      }),
    ),
  });

  // Default payment made entry values.
  const defaultPaymentMadeEntry = useMemo(
    () => ({ bill_id: '', payment_amount: '', id: null }),
    [],
  );

  // Default initial values.
  const defaultInitialValues = useMemo(
    () => ({
      full_amount: '',
      vendor_id: '',
      payment_account_id: '',
      payment_date: moment(new Date()).format('YYYY-MM-DD'),
      reference: '',
      payment_number: '',
      description: '',
      entries: [],
    }),
    [],
  );

  // Form initial values.
  const initialValues = useMemo(
    () => ({
      ...(paymentMade
        ? {
            ...pick(paymentMade, Object.keys(defaultInitialValues)),
            full_amount: sumBy(paymentMade.entries, 'payment_amount'),
            entries: [
              ...paymentMade.entries.map((paymentMadeEntry) => ({
                ...pick(paymentMadeEntry, Object.keys(defaultPaymentMadeEntry)),
              })),
            ],
          }
        : {
            ...defaultInitialValues,
            entries: orderingLinesIndexes(defaultInitialValues.entries),
          }),
    }),
    [paymentMade, defaultInitialValues, defaultPaymentMadeEntry],
  );

  const handleSubmitForm = (
    values,
    { setSubmitting, resetForm, setFieldError },
  ) => {
    setSubmitting(true);

    // Filters entries that have no `bill_id` or `payment_amount`.
    const entries = values.entries.filter((item) => {
      return !item.bill_id || item.payment_amount;
    });
    // Total payment amount of entries.
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

    // Triggers once the save request success.
    const onSaved = (response) => {
      AppToaster.show({
        message: formatMessage({
          id: paymentMadeId
            ? 'the_payment_made_has_been_successfully_edited'
            : 'the_payment_made_has_been_successfully_created',
        }),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);
      resetForm();
    };

    const onError = (errors) => {
      const getError = (errorType) => errors.find((e) => e.type === errorType);

      if (getError(ERRORS.PAYMENT_NUMBER_NOT_UNIQUE)) {
        setFieldError(
          'payment_number',
          formatMessage({ id: 'payment_number_is_not_unique' }),
        );
      }
      setSubmitting(false);
    };

    if (paymentMade && paymentMade.id) {
      requestEditPaymentMade(paymentMade.id, form).then(onSaved).catch(onError);
    } else {
      requestSubmitPaymentMade(form).then(onSaved).catch(onError);
    }
  };

  const {
    errors,
    touched,
    setFieldValue,
    getFieldProps,
    setValues,
    values,
    handleSubmit,
    isSubmitting,
  } = useFormik({
    validationSchema,
    initialValues,
    onSubmit: handleSubmitForm,
  });

  const handleFullAmountChange = useCallback(
    (value) => {
      if (value !== fullAmount) {
        setAmountChangeAlert(value);
      }
    },
    [fullAmount, setAmountChangeAlert],
  );
  // Handle cancel button of amount change alert.
  const handleCancelAmountChangeAlert = () => {
    setAmountChangeAlert(false);
  };
  // Handle confirm button of amount change alert.
  const handleConfirmAmountChangeAlert = () => {
    setFullAmount(amountChangeAlert);
    setAmountChangeAlert(false);
  };

  // Handle update data.
  const handleUpdataData = useCallback(
    (entries) => {
      setFieldValue('entries', entries);
    },
    [setFieldValue],
  );

  // Handle cancel button click.
  const handleCancelClick = useCallback(() => {
    history.push('/payment-mades');
  }, [history]);

  // Handle clear all lines button click.
  const handleClearAllLines = () => {
    setClearLinesAlert(true);
  };

  const handleCancelClearLines = useCallback(() => {
    setClearLinesAlert(false);
  }, [setClearLinesAlert]);

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

  // Handle clear button click.
  const handleClearBtnClick = useCallback(() => {
    setClearFormAlert(true);
  }, []);

  //
  const handleCancelClearFormAlert = () => {
    setClearFormAlert(false);
  };

  const handleConfirmCancelClearFormAlert = () => {
    setValues({
      ...defaultInitialValues,
      ...(paymentMadeId
        ? {
            vendor_id: values.vendor_id,
            payment_number: values.payment_number,
          }
        : {}),
    });
    setClearFormAlert(false);
  };

  return (
    <div
      className={classNames(CLASSES.PAGE_FORM, CLASSES.PAGE_FORM_PAYMENT_MADE)}
    >
      <form onSubmit={handleSubmit}>
        <PaymentMadeHeader
          paymentMadeId={paymentMadeId}
          vendorId={values.vendor_id}
          errors={errors}
          touched={touched}
          setFieldValue={setFieldValue}
          getFieldProps={getFieldProps}
          values={values}
          onFullAmountChanged={handleFullAmountChange}
        />
        <PaymentMadeItemsTable
          fullAmount={fullAmount}
          paymentEntries={values.entries}
          vendorId={values.vendor_id}
          paymentMadeId={paymentMadeId}
          onUpdateData={handleUpdataData}
          onClickClearAllLines={handleClearAllLines}
          errors={errors?.entries}
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

        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={<T id={'ok'} />}
          intent={Intent.WARNING}
          isOpen={clearFormAlert}
          onCancel={handleCancelClearFormAlert}
          onConfirm={handleConfirmCancelClearFormAlert}
        >
          <p>Are you sure to clear form data.</p>
        </Alert>

        <PaymentMadeFloatingActions
          isSubmitting={isSubmitting}
          onCancelClick={handleCancelClick}
          onClearBtnClick={handleClearBtnClick}
        />

        {/* <Dragzone
          initialFiles={initialAttachmentFiles}
          onDrop={handleDropFiles}
          onDeleteFile={handleDeleteFile}
          hint={'Attachments: Maxiumum size: 20MB'}
        /> */}
      </form>
    </div>
  );
}

export default compose(
  withPaymentMadeActions,
  withMediaActions,
  withPaymentMadeDetail(),
  withPaymentMade(({ nextPaymentNumberChanged }) => ({
    nextPaymentNumberChanged,
  })),
  withSettings(({ billPaymentSettings }) => ({
    paymentNextNumber: billPaymentSettings?.next_number,
    paymentNumberPrefix: billPaymentSettings?.number_prefix,
  })),
)(PaymentMadeForm);
