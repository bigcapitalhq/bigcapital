import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import moment from 'moment';
import { Intent } from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { pick, sumBy } from 'lodash';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';

import { CLASSES } from 'common/classes';
import { ERROR } from 'common/errors';

import {
  EditReceiptFormSchema,
  CreateReceiptFormSchema,
} from './ReceiptForm.schema';

import ReceiptFromHeader from './ReceiptFormHeader';
import EditableItemsEntriesTable from 'containers/Entries/EditableItemsEntriesTable';
import ReceiptFormFloatingActions from './ReceiptFormFloatingActions';
import ReceiptFormFooter from './ReceiptFormFooter';
import ReceiptNumberWatcher from './ReceiptNumberWatcher';

import withReceiptActions from './withReceiptActions';
import withReceiptDetail from './withReceiptDetail';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withMediaActions from 'containers/Media/withMediaActions';
import withSettings from 'containers/Settings/withSettings';

import { AppToaster } from 'components';
import Dragzone from 'components/Dragzone';
import useMedia from 'hooks/useMedia';

import {
  compose,
  repeatValue,
  orderingLinesIndexes,
  defaultToTransform,
} from 'utils';

const MIN_LINES_NUMBER = 4;

const defaultReceipt = {
  index: 0,
  item_id: null,
  rate: null,
  discount: 0,
  quantity: null,
  description: '',
};

const defaultInitialValues = {
  customer_id: '',
  deposit_account_id: '',
  receipt_number: '',
  receipt_date: moment(new Date()).format('YYYY-MM-DD'),
  reference_no: '',
  receipt_message: '',
  statement: '',
  entries: [...repeatValue(defaultReceipt, MIN_LINES_NUMBER)],
};

/**
 * Receipt form.
 */

function ReceiptForm({
  //#withMedia
  requestSubmitMedia,
  requestDeleteMedia,

  //#withReceiptActions
  requestSubmitReceipt,
  requestEditReceipt,

  //#withReceiptDetail
  receipt,

  //#withDashboard
  changePageTitle,
  changePageSubtitle,

  // #withSettings
  receiptNextNumber,
  receiptNumberPrefix,
  preferredDepositAccount,

  //#own Props
  receiptId,
  onFormSubmit,
  onCancelForm,
}) {
  const { formatMessage } = useIntl();
  const history = useHistory();

  const [submitPayload, setSubmitPayload] = useState({});
  const isNewMode = !receiptId;

  const receiptNumber = receiptNumberPrefix
    ? `${receiptNumberPrefix}-${receiptNextNumber}`
    : receiptNextNumber;

  useEffect(() => {
    const transactionNumber = !isNewMode
      ? receipt.receipt_number
      : receiptNumber;

    if (receipt && receipt.id) {
      changePageTitle(formatMessage({ id: 'edit_receipt' }));
    } else {
      changePageTitle(formatMessage({ id: 'new_receipt' }));
    }
    changePageSubtitle(
      defaultToTransform(transactionNumber, `No. ${transactionNumber}`, ''),
    );
  }, [
    isNewMode,
    changePageTitle,
    changePageSubtitle,
    receipt,
    receiptNumber,
    formatMessage,
  ]);

  // Initial values in create and edit mode.
  const initialValues = useMemo(
    () => ({
      ...(receipt
        ? {
            ...pick(receipt, Object.keys(defaultInitialValues)),
            entries: [
              ...receipt.entries.map((receipt) => ({
                ...pick(receipt, Object.keys(defaultReceipt)),
              })),
              ...repeatValue(
                defaultReceipt,
                Math.max(MIN_LINES_NUMBER - receipt.entries.length, 0),
              ),
            ],
          }
        : {
            ...defaultInitialValues,
            receipt_number: receiptNumber,
            deposit_account_id: parseInt(preferredDepositAccount),
            entries: orderingLinesIndexes(defaultInitialValues.entries),
          }),
    }),
    [receipt],
  );

  // Transform response error to fields.
  const handleErrors = (errors, { setErrors }) => {
    if (errors.some((e) => e.type === ERROR.SALE_RECEIPT_NUMBER_NOT_UNIQUE)) {
      setErrors({
        receipt_number: formatMessage({
          id: 'sale_receipt_number_not_unique',
        }),
      });
    }
  };

  // Handle the form submit.
  const handleFormSubmit = (
    values,
    { setErrors, setSubmitting, resetForm },
  ) => {
    const entries = values.entries.filter(
      (item) => item.item_id && item.quantity,
    );

    const totalQuantity = sumBy(entries, (entry) => parseInt(entry.quantity));

    if (totalQuantity === 0) {
      AppToaster.show({
        message: formatMessage({
          id: 'quantity_cannot_be_zero_or_empty',
        }),
        intent: Intent.DANGER,
      });
      setSubmitting(false);
      return;
    }
    const form = {
      ...values,
      entries: entries.map((entry) => ({
        // Exclude all properties that out of request entries schema.
        ...pick(entry, Object.keys(defaultReceipt)),
      })),
    };
    // Handle the request success.
    const onSuccess = (response) => {
      AppToaster.show({
        message: formatMessage(
          {
            id: isNewMode
              ? 'the_receipt_has_been_successfully_created'
              : 'the_receipt_has_been_successfully_edited',
          },
          { number: values.receipt_number },
        ),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);
      resetForm();

      if (submitPayload.redirect) {
        history.push('/receipts');
      }
    };

    // Handle the request error.
    const onError = (errors) => {
      handleErrors(errors, { setErrors });
      setSubmitting(false);
    };

    if (receipt && receipt.id) {
      requestEditReceipt(receipt.id, form).then(onSuccess).catch(onError);
    } else {
      requestSubmitReceipt(form).then(onSuccess).catch(onError);
    }
  };

  const handleReceiptNumberChanged = useCallback(
    (receiptNumber) => {
      changePageSubtitle(
        defaultToTransform(receiptNumber, `No. ${receiptNumber}`, ''),
      );
    },
    [changePageSubtitle],
  );

  const handleSubmitClick = (event) => {
    setSubmitPayload({ redirect: true });
  };

  const handleSubmitAndNewClick = (event) => {
    setSubmitPayload({ redirect: false });
  };

  const handleCancelClick = (event) => {
    history.goBack();
  };

  return (
    <div className={classNames(CLASSES.PAGE_FORM_RECEIPT, CLASSES.PAGE_FORM)}>
      <Formik
        validationSchema={
          isNewMode ? CreateReceiptFormSchema : EditReceiptFormSchema
        }
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
      >
        <Form>
          <ReceiptFromHeader
            onReceiptNumberChanged={handleReceiptNumberChanged}
          />
          <ReceiptNumberWatcher receiptNumber={receiptNumber} />
          <EditableItemsEntriesTable filterSellableItems={true} />
          <ReceiptFormFooter />
          <ReceiptFormFloatingActions
            receiptId={receiptId}
            onSubmitClick={handleSubmitClick}
            onSubmitAndNewClick={handleSubmitAndNewClick}
            onCancelForm={handleCancelClick}
          />
        </Form>
      </Formik>
    </div>
  );
}

export default compose(
  withReceiptActions,
  withReceiptDetail(),
  withDashboardActions,
  withMediaActions,
  withSettings(({ receiptSettings }) => ({
    receiptNextNumber: receiptSettings?.nextNumber,
    receiptNumberPrefix: receiptSettings?.numberPrefix,
    preferredDepositAccount: receiptSettings?.preferredDepositAccount,
  })),
)(ReceiptForm);
