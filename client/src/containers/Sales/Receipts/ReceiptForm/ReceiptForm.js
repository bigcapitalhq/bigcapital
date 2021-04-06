import React, { useMemo } from 'react';
import { Formik, Form } from 'formik';
import { Intent } from '@blueprintjs/core';
import { useIntl } from 'react-intl';
import { omit, sumBy, isEmpty } from 'lodash';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';

import { CLASSES } from 'common/classes';
import { ERROR } from 'common/errors';
import {
  EditReceiptFormSchema,
  CreateReceiptFormSchema,
} from './ReceiptForm.schema';

import { useReceiptFormContext } from './ReceiptFormProvider';

import ReceiptFromHeader from './ReceiptFormHeader';
import ReceiptItemsEntriesEditor from './ReceiptItemsEntriesEditor';
import ReceiptFormFloatingActions from './ReceiptFormFloatingActions';
import ReceiptFormFooter from './ReceiptFormFooter';
import ReceiptFormDialogs from './ReceiptFormDialogs';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withSettings from 'containers/Settings/withSettings';

import { AppToaster } from 'components';
import { compose, orderingLinesIndexes, transactionNumber } from 'utils';
import { transformToEditForm, defaultReceipt } from './utils';

/**
 * Receipt form.
 */
function ReceiptForm({
  // #withSettings
  receiptNextNumber,
  receiptNumberPrefix,
  receiptAutoIncrement,
  preferredDepositAccount,
  baseCurrency,
}) {
  const { formatMessage } = useIntl();
  const history = useHistory();

  // Receipt form context.
  const {
    receipt,
    editReceiptMutate,
    createReceiptMutate,
    submitPayload,
    isNewMode,
  } = useReceiptFormContext();

  // The next receipt number.
  const nextReceiptNumber = transactionNumber(
    receiptNumberPrefix,
    receiptNextNumber,
  );
  // Initial values in create and edit mode.
  const initialValues = useMemo(
    () => ({
      ...(!isEmpty(receipt)
        ? transformToEditForm(receipt)
        : {
            ...defaultReceipt,
            ...(receiptAutoIncrement && {
              receipt_number: nextReceiptNumber,
            }),
            deposit_account_id: parseInt(preferredDepositAccount),
            entries: orderingLinesIndexes(defaultReceipt.entries),
            currency_code: baseCurrency,
          }),
    }),
    [receipt, preferredDepositAccount, nextReceiptNumber, receiptAutoIncrement],
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
      ...omit(values, ['receipt_number_manually', 'receipt_number']),
      ...(values.receipt_number_manually && {
        receipt_number: values.receipt_number,
        currency_code: baseCurrency,
      }),
      closed: submitPayload.status,
      entries: entries.map((entry) => ({ ...omit(entry, ['total']) })),
    };
    // Handle the request success.
    const onSuccess = (response) => {
      AppToaster.show({
        message: formatMessage(
          {
            id: isNewMode
              ? 'the_receipt_has_been_created_successfully'
              : 'the_receipt_has_been_edited_successfully',
          },
          { number: values.receipt_number },
        ),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);

      if (submitPayload.redirect) {
        history.push('/receipts');
      }
      if (submitPayload.resetForm) {
        resetForm();
      }
    };

    // Handle the request error.
    const onError = ({
      response: {
        data: { errors },
      },
    }) => {
      if (errors) {
        handleErrors(errors, { setErrors });
      }
      setSubmitting(false);
    };
    if (!isNewMode) {
      editReceiptMutate([receipt.id, form]).then(onSuccess).catch(onError);
    } else {
      createReceiptMutate(form).then(onSuccess).catch(onError);
    }
  };

  return (
    <div
      className={classNames(
        CLASSES.PAGE_FORM,
        CLASSES.PAGE_FORM_STRIP_STYLE,
        CLASSES.PAGE_FORM_RECEIPT,
      )}
    >
      <Formik
        validationSchema={
          isNewMode ? CreateReceiptFormSchema : EditReceiptFormSchema
        }
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
      >
        <Form>
          <ReceiptFromHeader />
          <ReceiptItemsEntriesEditor />
          <ReceiptFormFooter />
          <ReceiptFormFloatingActions />

          <ReceiptFormDialogs />
        </Form>
      </Formik>
    </div>
  );
}

export default compose(
  withDashboardActions,
  withSettings(({ receiptSettings, organizationSettings }) => ({
    receiptNextNumber: receiptSettings?.nextNumber,
    receiptNumberPrefix: receiptSettings?.numberPrefix,
    receiptAutoIncrement: receiptSettings?.autoIncrement,
    preferredDepositAccount: receiptSettings?.preferredDepositAccount,
    baseCurrency: organizationSettings?.baseCurrency,
  })),
)(ReceiptForm);
