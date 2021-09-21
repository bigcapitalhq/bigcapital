import moment from 'moment';
import intl from 'react-intl-universal';
import * as R from 'ramda';
import { Intent } from '@blueprintjs/core';
import { AppToaster } from 'components';
import {
  defaultFastFieldShouldUpdate,
  transformToForm,
  repeatValue,
  orderingLinesIndexes,
} from 'utils';
import {
  updateItemsEntriesTotal,
  ensureEntriesHaveEmptyLine,
} from 'containers/Entries/utils';
import { isLandedCostDisabled } from '../../../Entries/utils';

export const MIN_LINES_NUMBER = 4;

// Default bill entry.
export const defaultBillEntry = {
  index: 0,
  item_id: '',
  rate: '',
  discount: '',
  quantity: '',
  description: '',
  amount: '',
  landed_cost: false,
};

// Default bill.
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

/**
 * Transformes the bill to initial values of edit form.
 */
export const transformToEditForm = (bill) => {
  const initialEntries = [
    ...bill.entries.map((entry) => ({
      ...transformToForm(entry, defaultBillEntry),
      landed_cost_disabled: isLandedCostDisabled(entry.item),
    })),
    ...repeatValue(
      defaultBillEntry,
      Math.max(MIN_LINES_NUMBER - bill.entries.length, 0),
    ),
  ];
  const entries = R.compose(
    ensureEntriesHaveEmptyLine(defaultBillEntry),
    updateItemsEntriesTotal,
  )(initialEntries);

  return {
    ...transformToForm(bill, defaultBill),
    entries,
  };
};

/**
 * Transformes bill entries to submit request.
 */
export const transformEntriesToSubmit = (entries) => {
  const transformBillEntry = R.curry(transformToForm)(R.__, defaultBillEntry);

  return R.compose(orderingLinesIndexes, R.map(transformBillEntry))(entries);
};

/**
 * Handle delete errors.
 */
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
