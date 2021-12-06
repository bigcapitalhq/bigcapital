import React from 'react';
import * as R from 'ramda';
import moment from 'moment';

import {
  defaultFastFieldShouldUpdate,
  transformToForm,
  repeatValue,
  transactionNumber,
  orderingLinesIndexes,
} from 'utils';
import {
  updateItemsEntriesTotal,
  ensureEntriesHaveEmptyLine,
} from 'containers/Entries/utils';
import { useFormikContext } from 'formik';

export const MIN_LINES_NUMBER = 4;

// Default Vendors Credit Note entry.
export const defaultCreditNoteEntry = {
  index: 0,
  item_id: '',
  rate: '',
  discount: '',
  quantity: '',
  description: '',
  amount: '',
};

// Default Vendors Credit Note.
export const defaultVendorsCreditNote = {
  vendor_id: '',
  vendor_credit_number: '',
  vendor_credit_no_manually: false,
  open: '',
  vendor_credit_date: moment(new Date()).format('YYYY-MM-DD'),
  // reference_no: '',
  note: '',
  entries: [...repeatValue(defaultCreditNoteEntry, MIN_LINES_NUMBER)],
};

/**
 * Transformes the credit note to initial values of edit form.
 */
export const transformToEditForm = (creditNote) => {
  const initialEntries = [
    ...creditNote.entries.map((entry) => ({
      ...transformToForm(entry, defaultCreditNoteEntry),
    })),
    ...repeatValue(
      defaultCreditNoteEntry,
      Math.max(MIN_LINES_NUMBER - creditNote.entries.length, 0),
    ),
  ];
  const entries = R.compose(
    ensureEntriesHaveEmptyLine(defaultCreditNoteEntry),
    updateItemsEntriesTotal,
  )(initialEntries);

  return {
    ...transformToForm(creditNote, defaultVendorsCreditNote),
    entries,
  };
};

/**
 * Transformes credit note entries to submit request.
 */
export const transformEntriesToSubmit = (entries) => {
  const transformCreditNoteEntry = R.compose(
    R.omit(['amount']),
    R.curry(transformToForm)(R.__, defaultCreditNoteEntry),
  );
  return R.compose(
    orderingLinesIndexes,
    R.map(transformCreditNoteEntry),
  )(entries);
};

/**
 * Filters the givne non-zero entries.
 */
export const filterNonZeroEntries = (entries) => {
  return entries.filter((item) => item.item_id && item.quantity);
};

/**
 * Transformes form values to request body.
 */
export const transformFormValuesToRequest = (values) => {
  const entries = filterNonZeroEntries(values.entries);

  return {
    ...values,
    entries: transformEntriesToSubmit(entries),
    open: false,
  };
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

/**
 * Syncs invoice no. settings with form.
 */
export const useObserveVendorCreditNoSettings = (prefix, nextNumber) => {
  const { setFieldValue } = useFormikContext();

  React.useEffect(() => {
    const creditNo = transactionNumber(prefix, nextNumber);
    setFieldValue('vendor_credit_number', creditNo);
  }, [setFieldValue, prefix, nextNumber]);
};
