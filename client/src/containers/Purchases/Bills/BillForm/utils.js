import moment from 'moment';
import intl from 'react-intl-universal';
import { Intent } from '@blueprintjs/core';
import { AppToaster } from 'components';
import { transformToForm, repeatValue } from 'utils';

export const MIN_LINES_NUMBER = 4;

export const defaultBillEntry = {
  index: 0,
  item_id: '',
  rate: '',
  discount: '',
  quantity: '',
  description: '',
};

export const defaultBill = {
  vendor_id: '',
  bill_number: '',
  bill_date: moment(new Date()).format('YYYY-MM-DD'),
  due_date: moment(new Date()).format('YYYY-MM-DD'),
  reference_no: '',
  note: '',
  open: '',
  entries: [...repeatValue(defaultBillEntry, MIN_LINES_NUMBER)],
};

export const transformToEditForm = (bill) => {
  return {
    ...transformToForm(bill, defaultBill),
    entries: [
      ...bill.entries.map((bill) => ({
        ...transformToForm(bill, defaultBill.entries[0]),
      })),
      ...repeatValue(
        defaultBill,
        Math.max(MIN_LINES_NUMBER - bill.entries.length, 0),
      ),
    ],
  };
};

// handle delete errors.
export const handleDeleteErrors = (errors) => {
  if (
    errors.find((error) => error.type === 'BILL_HAS_ASSOCIATED_PAYMENT_ENTRIES')
  ) {
    AppToaster.show({
      message: intl.get('cannot_delete_bill_that_has_payment_transactions'),
      intent: Intent.DANGER,
    });
  }
};
