import React from 'react';
import { useFormikContext } from 'formik';
import moment from 'moment';
import { transactionNumber, transformToForm, safeSumBy } from 'utils';

// Default payment receive entry.
export const defaultPaymentReceiveEntry = {
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
  entries: [],
};

/**
 *
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
