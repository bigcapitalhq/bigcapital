import React from 'react';
import { useFormikContext } from 'formik';
import moment from 'moment';
import { omit, pick, first } from 'lodash';
import { usePaymentReceiveFormContext } from './PaymentReceiveFormProvider';
import {
  defaultFastFieldShouldUpdate,
  transactionNumber,
  transformToForm,
  safeSumBy,
  orderingLinesIndexes,
} from 'utils';

// Default payment receive entry.
export const defaultPaymentReceiveEntry = {
  index: '',
  payment_amount: '',
  invoice_id: '',
  invoice_no: '',
  due_amount: '',
  date: '',
  amount: '',
  currency_code: '',
};

// Form initial values.
export const defaultPaymentReceive = {
  customer_id: '',
  deposit_account_id: '',
  payment_date: moment(new Date()).format('YYYY-MM-DD'),
  reference_no: '',
  payment_receive_no: '',
  statement: '',
  full_amount: '',
  currency_code: '',
  branch_id: '',
  exchange_rate: 1,
  entries: [],
};

export const defaultRequestPaymentEntry = {
  index: '',
  payment_amount: '',
  invoice_id: '',
};

export const defaultRequestPayment = {
  customer_id: '',
  deposit_account_id: '',
  payment_date: '',
  payment_receive_no: '',
  branch_id: '',
  statement: '',
  entries: [],
};

/**
 * Transformes the edit payment receive to initial values of the form.
 */
export const transformToEditForm = (paymentReceive, paymentReceiveEntries) => ({
  ...transformToForm(paymentReceive, defaultPaymentReceive),
  full_amount: safeSumBy(paymentReceiveEntries, 'payment_amount'),
  entries: [
    ...paymentReceiveEntries.map((paymentReceiveEntry) => ({
      ...transformToForm(paymentReceiveEntry, defaultPaymentReceiveEntry),
      payment_amount: paymentReceiveEntry.payment_amount || '',
    })),
  ],
});

/**
 * Transformes the given invoices to the new page receivable entries.
 */
export const transformInvoicesNewPageEntries = (invoices) => [
  ...invoices.map((invoice, index) => ({
    index: index + 1,
    invoice_id: invoice.id,
    entry_type: 'invoice',
    due_amount: invoice.due_amount,
    date: invoice.invoice_date,
    amount: invoice.balance,
    currency_code: invoice.currency_code,
    payment_amount: '',
    invoice_no: invoice.invoice_no,
    branch_id: invoice.branch_id,
    total_payment_amount: invoice.payment_amount,
  })),
];

export const transformEntriesToEditForm = (receivableEntries) => [
  ...transformInvoicesNewPageEntries([...(receivableEntries || [])]),
];

export const clearAllPaymentEntries = (entries) => [
  ...entries.map((entry) => ({ ...entry, payment_amount: 0 })),
];

export const amountPaymentEntries = (amount, entries) => {
  let total = amount;

  return entries.map((item) => {
    const diff = Math.min(item.due_amount, total);
    total -= Math.max(diff, 0);

    return {
      ...item,
      payment_amount: diff,
    };
  });
};

export const fullAmountPaymentEntries = (entries) => {
  return entries.map((item) => ({
    ...item,
    payment_amount: item.due_amount,
  }));
};

/**
 * Syncs payment receive number settings with form.
 */
export const useObservePaymentNoSettings = (prefix, nextNumber) => {
  const { setFieldValue } = useFormikContext();

  React.useEffect(() => {
    const invoiceNo = transactionNumber(prefix, nextNumber);
    setFieldValue('payment_receive_no', invoiceNo);
  }, [setFieldValue, prefix, nextNumber]);
};

/**
 * Detarmines the customers fast-field should update.
 */
export const customersFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.customers !== oldProps.customers ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

/**
 * Detarmines the accounts fast-field should update.
 */
export const accountsFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.accounts !== oldProps.accounts ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

/**
 * Tranformes form values to request.
 */
export const transformFormToRequest = (form) => {
  // Filters entries that have no `invoice_id` and `payment_amount`.
  const entries = form.entries
    .filter((entry) => entry.invoice_id && entry.payment_amount)
    .map((entry) => ({
      ...pick(entry, Object.keys(defaultRequestPaymentEntry)),
    }));

  return {
    ...omit(form, ['payment_receive_no_manually', 'payment_receive_no']),
    ...(form.payment_receive_no_manually && {
      payment_receive_no: form.payment_receive_no,
    }),
    entries: orderingLinesIndexes(entries),
  };
};

export const useSetPrimaryBranchToForm = () => {
  const { setFieldValue } = useFormikContext();
  const { branches, isBranchesSuccess } = usePaymentReceiveFormContext();

  React.useEffect(() => {
    if (isBranchesSuccess) {
      const primaryBranch = branches.find((b) => b.primary) || first(branches);

      if (primaryBranch) {
        setFieldValue('branch_id', primaryBranch.id);
      }
    }
  }, [isBranchesSuccess, setFieldValue, branches]);
};
