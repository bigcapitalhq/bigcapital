import React from 'react';
import moment from 'moment';
import intl from 'react-intl-universal';
import { pick, first } from 'lodash';
import { useFormikContext } from 'formik';
import { Intent } from '@blueprintjs/core';
import { AppToaster } from 'components';
import { usePaymentMadeFormContext } from './PaymentMadeFormProvider';
import {
  defaultFastFieldShouldUpdate,
  safeSumBy,
  transformToForm,
  orderingLinesIndexes,
} from 'utils';

export const ERRORS = {
  PAYMENT_NUMBER_NOT_UNIQUE: 'PAYMENT.NUMBER.NOT.UNIQUE',
};

// Default payment made entry values.
export const defaultPaymentMadeEntry = {
  bill_id: '',
  payment_amount: '',
  currency_code: '',
  id: null,
  due_amount: null,
  amount: '',
};

// Default initial values of payment made.
export const defaultPaymentMade = {
  full_amount: '',
  vendor_id: '',
  payment_account_id: '',
  payment_date: moment(new Date()).format('YYYY-MM-DD'),
  reference: '',
  payment_number: '',
  statement: '',
  currency_code: '',
  branch_id: '',
  exchange_rate: 1,
  entries: [],
};

export const transformToEditForm = (paymentMade, paymentMadeEntries) => {
  return {
    ...transformToForm(paymentMade, defaultPaymentMade),
    full_amount: safeSumBy(paymentMadeEntries, 'payment_amount'),
    entries: [
      ...paymentMadeEntries.map((paymentMadeEntry) => ({
        ...transformToForm(paymentMadeEntry, defaultPaymentMadeEntry),
        payment_amount: paymentMadeEntry.payment_amount || '',
      })),
    ],
  };
};

/**
 * Transform the new page entries.
 */
export const transformToNewPageEntries = (entries) => {
  return entries.map((entry) => ({
    ...transformToForm(entry, defaultPaymentMadeEntry),
    payment_amount: '',
    currency_code: entry.currency_code,
  }));
};

/**
 * Detarmines vendors fast field when update.
 */
export const vendorsFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.vendors !== oldProps.vendors ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

/**
 * Detarmines accounts fast field when update.
 */
export const accountsFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.accounts !== oldProps.accounts ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

/**
 * Transformes the form values to request body.
 */
export const transformFormToRequest = (form) => {
  // Filters entries that have no `bill_id` or `payment_amount`.
  const entries = form.entries
    .filter((item) => item.bill_id && item.payment_amount)
    .map((entry) => ({
      ...pick(entry, ['payment_amount', 'bill_id']),
    }));

  return { ...form, entries: orderingLinesIndexes(entries) };
};

export const useSetPrimaryBranchToForm = () => {
  const { setFieldValue } = useFormikContext();
  const { branches, isBranchesSuccess } = usePaymentMadeFormContext();

  React.useEffect(() => {
    if (isBranchesSuccess) {
      const primaryBranch = branches.find((b) => b.primary) || first(branches);

      if (primaryBranch) {
        setFieldValue('branch_id', primaryBranch.id);
      }
    }
  }, [isBranchesSuccess, setFieldValue, branches]);
};

/**
 * Transformes the response errors types.
 */
export const transformErrors = (errors, { setFieldError }) => {
  const getError = (errorType) => errors.find((e) => e.type === errorType);

  if (getError('PAYMENT_NUMBER_NOT_UNIQUE')) {
    setFieldError('payment_number', intl.get('payment_number_is_not_unique'));
  }
  if (getError('WITHDRAWAL_ACCOUNT_CURRENCY_INVALID')) {
    AppToaster.show({
      message: intl.get('payment_made.error.withdrawal_account_currency_invalid'),
      intent: Intent.DANGER,
    });
  }
};
