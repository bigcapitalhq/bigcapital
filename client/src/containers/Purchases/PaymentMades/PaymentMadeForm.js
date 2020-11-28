import React, { useMemo, useState, useCallback, useEffect } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import moment from 'moment';
import { Intent, Alert } from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { pick, sumBy, omit } from 'lodash';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';

import { CLASSES } from 'common/classes';
import { AppToaster } from 'components';
import PaymentMadeHeader from './PaymentMadeFormHeader';
import PaymentMadeFloatingActions from './PaymentMadeFloatingActions';
import PaymentMadeItemsTable from './PaymentMadeItemsTable';
import PaymentMadeFooter from './PaymentMadeFooter';

import withMediaActions from 'containers/Media/withMediaActions';
import withPaymentMadeActions from './withPaymentMadeActions';
import withPaymentMadeDetail from './withPaymentMadeDetail';
import withPaymentMade from './withPaymentMade';
import withSettings from 'containers/Settings/withSettings';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import {
  EditPaymentMadeFormSchema,
  CreatePaymentMadeFormSchema,
} from './PaymentMadeForm.schema';
import { compose, orderingLinesIndexes } from 'utils';

const ERRORS = {
  PAYMENT_NUMBER_NOT_UNIQUE: 'PAYMENT.NUMBER.NOT.UNIQUE',
};

// Default payment made entry values.x
const defaultPaymentMadeEntry = {
  bill_id: '',
  payment_amount: '',
  id: null,
  due_amount: null,
};
// Default initial values.
const defaultInitialValues = {
  full_amount: '',
  vendor_id: '',
  payment_account_id: '',
  payment_date: moment(new Date()).format('YYYY-MM-DD'),
  reference: '',
  payment_number: '',
  description: '',
  entries: [],
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

  // #withBills
  paymentMadeEntries,

  // #withDashboardActions
  changePageSubtitle,

  // #ownProps
  paymentMadeId,
}) {
  const history = useHistory();
  const { formatMessage } = useIntl();
  const isNewMode = !paymentMadeId;
  const [amountChangeAlert, setAmountChangeAlert] = useState(false);
  const [clearLinesAlert, setClearLinesAlert] = useState(false);
  const [clearFormAlert, setClearFormAlert] = useState(false);
  const [fullAmount, setFullAmount] = useState(null);
  const [submitPayload, setSubmitPayload] = useState({});

  const [localPaymentEntries, setLocalPaymentEntries] = useState(
    paymentMadeEntries,
  );

  useEffect(() => {
    if (localPaymentEntries !== paymentMadeEntries) {
      setLocalPaymentEntries(paymentMadeEntries);
    }
  }, [localPaymentEntries, paymentMadeEntries]);

  // Yup validation schema.
  const validationSchema = isNewMode
    ? CreatePaymentMadeFormSchema
    : EditPaymentMadeFormSchema;

  // Form initial values.
  const initialValues = useMemo(
    () => ({
      ...(paymentMade
        ? {
            ...pick(paymentMade, Object.keys(defaultInitialValues)),
            full_amount: sumBy(paymentMade.entries, 'payment_amount'),
            entries: [
              ...paymentMadeEntries.map((paymentMadeEntry) => ({
                ...pick(paymentMadeEntry, Object.keys(defaultPaymentMadeEntry)),
              })),
            ],
          }
        : {
            ...defaultInitialValues,
            entries: orderingLinesIndexes(defaultInitialValues.entries),
          }),
    }),
    [paymentMade, paymentMadeEntries],
  );

  const handleSubmitForm = (
    values,
    { setSubmitting, resetForm, setFieldError },
  ) => {
    setSubmitting(true);

    // Filters entries that have no `bill_id` or `payment_amount`.
    const entries = values.entries
      .filter((item) => !item.bill_id || item.payment_amount)
      .map((entry) => ({
        ...omit(entry, ['due_amount']),
      }));
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
      // resetForm();
      changePageSubtitle('');

      if (submitPayload.redirect) {
        history.push('/payment-mades');
      }

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
    submitForm,
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

  const transformPaymentEntries = (entries) => {
    return entries.map((entry) => ({
      ...pick(entry, Object.keys(defaultPaymentMadeEntry)),
    }));
  };
  // Handle update data.
  const handleUpdataData = useCallback(
    (entries) => {
      setFieldValue('entries', transformPaymentEntries(entries));
    },
    [setFieldValue],
  );

  const resetEntriesPaymentAmount = (entries) => {
    return entries.map((entry) => ({ ...entry, payment_amount: 0 }));
  };
  // Handle fetch success of vendor bills entries.
  const handleFetchEntriesSuccess = useCallback(
    (entries) => {
      setFieldValue('entries', transformPaymentEntries(entries));
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
    setLocalPaymentEntries(resetEntriesPaymentAmount(localPaymentEntries));
    setFieldValue('entries', resetEntriesPaymentAmount(values.entries));

    setClearLinesAlert(false);
  }, [setFieldValue, localPaymentEntries, values.entries]);

  // Handle clear button click.
  const handleClearBtnClick = useCallback(() => {
    setClearFormAlert(true);
  }, []);

  // Handle cancel button clear
  const handleCancelClearFormAlert = () => {
    setClearFormAlert(false);
  };
  // Handle confirm button click of clear form alert.
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
  // Payable full amount.
  const payableFullAmount = useMemo(() => sumBy(values.entries, 'due_amount'), [
    values.entries,
  ]);

  const handlePaymentNoChanged = (paymentNumber) => {
    changePageSubtitle(paymentNumber);
  };

  // Clear page subtitle before once page leave.
  useEffect(
    () => () => {
      changePageSubtitle('');
    },
    [changePageSubtitle],
  );

  const fullAmountPaid = useMemo(
    () => sumBy(values.entries, 'payment_amount'),
    [values.entries],
  );

  const handleSubmitClick = useCallback(
    (event, payload) => {
      setSubmitPayload({ ...payload });
    },
    [setSubmitPayload],
  );


  return (
    <div
      className={classNames(
        CLASSES.PAGE_FORM,
        CLASSES.PAGE_FORM_STRIP_STYLE,
        CLASSES.PAGE_FORM_PAYMENT_MADE,
      )}
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
          payableFullAmount={payableFullAmount}
          onFullAmountChanged={handleFullAmountChange}
          onPaymentNumberChanged={handlePaymentNoChanged}
          amountPaid={fullAmountPaid}
        />

        <div className={classNames(CLASSES.PAGE_FORM_BODY)}>
          <PaymentMadeItemsTable
            fullAmount={fullAmount}
            paymentEntries={localPaymentEntries}
            vendorId={values.vendor_id}
            paymentMadeId={paymentMadeId}
            onUpdateData={handleUpdataData}
            onClickClearAllLines={handleClearAllLines}
            errors={errors?.entries}
            onFetchEntriesSuccess={handleFetchEntriesSuccess}
            vendorPayableBillsEntrie={[]}
          />
        </div>
        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={<T id={'ok'} />}
          intent={Intent.DANGER}
          isOpen={amountChangeAlert}
          onCancel={handleCancelAmountChangeAlert}
          onConfirm={handleConfirmAmountChangeAlert}
        >
          <p>
            Changing full amount will change all credit and payment were
            applied, Is this okay?
          </p>
        </Alert>

        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={<T id={'ok'} />}
          intent={Intent.DANGER}
          isOpen={clearLinesAlert}
          onCancel={handleCancelClearLines}
          onConfirm={handleConfirmClearLines}
        >
          <p>
            Clearing the table lines will delete all credits and payments were
            applied. Is this okay?
          </p>
        </Alert>

        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={<T id={'ok'} />}
          intent={Intent.DANGER}
          isOpen={clearFormAlert}
          onCancel={handleCancelClearFormAlert}
          onConfirm={handleConfirmCancelClearFormAlert}
        >
          <p>Are you sure you want to clear this transaction?</p>
        </Alert>

        <PaymentMadeFooter getFieldProps={getFieldProps} />

        <PaymentMadeFloatingActions
          isSubmitting={isSubmitting}
          paymentMadeId={paymentMadeId}
          onSubmitClick={handleSubmitClick}
          onCancelClick={handleCancelClick}
          onClearBtnClick={handleClearBtnClick}
          onSubmitForm={submitForm}
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
  withPaymentMade(
    ({ nextPaymentNumberChanged, paymentMadeEntries }, state, props) => ({
      nextPaymentNumberChanged,
      paymentMadeEntries,
    }),
  ),
  withSettings(({ billPaymentSettings }) => ({
    paymentNextNumber: billPaymentSettings?.next_number,
    paymentNumberPrefix: billPaymentSettings?.number_prefix,
  })),
  withDashboardActions,
)(PaymentMadeForm);
