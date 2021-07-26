import moment from 'moment';
import intl from 'react-intl-universal';
import { Intent } from '@blueprintjs/core';
import { AppToaster } from 'components';
import {
  defaultFastFieldShouldUpdate,
  transformToForm,
  repeatValue,
} from 'utils';

export const MIN_LINES_NUMBER = 4;

export const defaultBillEntry = {
  index: 0,
  item_id: '',
  rate: '',
  discount: '',
  quantity: '',
  description: '',
  landed_cost: false,
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
  if (
    errors.find((error) => error.type === 'BILL_HAS_ASSOCIATED_LANDED_COSTS')
  ) {
    AppToaster.show({
      message: intl.get(
        'cannot_delete_bill_that_has_associated_landed_cost_transactions',
      ),
      intent: Intent.DANGER,
    });
  }
};

/**
 * Detarmines vendors fast field should update
 */
export const vendorsFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.vendors !== oldProps.vendors ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

/**
 * Detarmines entries fast field should update.
 */
export const entriesFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.items !== oldProps.items ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};
