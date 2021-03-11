import React from 'react';
import { useFormikContext } from 'formik';
import moment from 'moment';
import { transactionNumber, repeatValue, transformToForm } from 'utils';

export const MIN_LINES_NUMBER = 4;

export const defaultReceiptEntry = {
  index: 0,
  item_id: '',
  rate: '',
  discount: '',
  quantity: '',
  description: '',
};

export const defaultReceipt = {
  customer_id: '',
  deposit_account_id: '',
  receipt_number: '',
  receipt_date: moment(new Date()).format('YYYY-MM-DD'),
  reference_no: '',
  receipt_message: '',
  statement: '',
  closed: '',
  entries: [...repeatValue(defaultReceiptEntry, MIN_LINES_NUMBER)],
};

/**
 * Transform to form in edit mode.
 */
export const transformToEditForm = (receipt) => ({
  ...transformToForm(receipt, defaultReceipt),
  entries: [
    ...receipt.entries.map((entry) => ({
      ...transformToForm(entry, defaultReceiptEntry),
    })),
    ...repeatValue(
      defaultReceiptEntry,
      Math.max(MIN_LINES_NUMBER - receipt.entries.length, 0),
    ),
  ],
});


export const useObserveReceiptNoSettings = (prefix, nextNumber) => {
  const { setFieldValue } = useFormikContext();

  React.useEffect(() => {
    const receiptNo = transactionNumber(prefix, nextNumber);
    setFieldValue('receipt_number', receiptNo);
  }, [setFieldValue, prefix, nextNumber]);
}