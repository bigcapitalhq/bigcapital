import moment from 'moment';
import { repeatValue, transformToForm } from 'utils';

export const MIN_LINES_NUMBER = 4;

export const defaultReceiptEntry = {
  index: 0,
  item_id: '',
  rate: '',
  discount: 0,
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
