import React from 'react';
import * as R from 'ramda';
import moment from 'moment';
import { first } from 'lodash';

import {
  defaultFastFieldShouldUpdate,
  transformToForm,
  repeatValue,
  transactionNumber,
  orderingLinesIndexes,
} from 'utils';
import { useFormikContext } from 'formik';
import { useCreditNoteFormContext } from './CreditNoteFormProvider';

import {
  updateItemsEntriesTotal,
  ensureEntriesHaveEmptyLine,
} from 'containers/Entries/utils';

export const MIN_LINES_NUMBER = 4;

// Default entry object.
export const defaultCreditNoteEntry = {
  index: 0,
  item_id: '',
  rate: '',
  discount: '',
  quantity: '',
  description: '',
  amount: '',
};

// Default credit note object.
export const defaultCreditNote = {
  customer_id: '',
  credit_note_date: moment(new Date()).format('YYYY-MM-DD'),
  credit_note_number: '',
  credit_note_no_manually: false,
  open: '',
  reference_no: '',
  note: '',
  terms_conditions: '',
  branch_id: '',
  warehouse_id: '',
  exchange_rate: 1,
  currency_code: '',
  entries: [...repeatValue(defaultCreditNoteEntry, MIN_LINES_NUMBER)],
};

/**
 * Transform credit note to initial values in edit mode.
 */
export function transformToEditForm(creditNote) {
  const initialEntries = [
    ...creditNote.entries.map((creditNote) => ({
      ...transformToForm(creditNote, defaultCreditNoteEntry),
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
    ...transformToForm(creditNote, defaultCreditNote),
    entries,
  };
}

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
 * Determines customer name field when should update.
 */
export const customerNameFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.customers !== oldProps.customers ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

/**
 * Determines invoice entries field when should update.
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
export const useObserveCreditNoSettings = (prefix, nextNumber) => {
  const { setFieldValue } = useFormikContext();

  React.useEffect(() => {
    const creditNo = transactionNumber(prefix, nextNumber);
    setFieldValue('credit_note_number', creditNo);
  }, [setFieldValue, prefix, nextNumber]);
};

export const useSetPrimaryBranchToForm = () => {
  const { setFieldValue } = useFormikContext();
  const { branches, isBranchesSuccess } = useCreditNoteFormContext();

  React.useEffect(() => {
    if (isBranchesSuccess) {
      const primaryBranch = branches.find((b) => b.primary) || first(branches);

      if (primaryBranch) {
        setFieldValue('branch_id', primaryBranch.id);
      }
    }
  }, [isBranchesSuccess, setFieldValue, branches]);
};

export const useSetPrimaryWarehouseToForm = () => {
  const { setFieldValue } = useFormikContext();
  const { warehouses, isWarehousesSuccess } = useCreditNoteFormContext();

  React.useEffect(() => {
    if (isWarehousesSuccess) {
      const primaryWarehouse =
        warehouses.find((b) => b.primary) || first(warehouses);

      if (primaryWarehouse) {
        setFieldValue('warehouse_id', primaryWarehouse.id);
      }
    }
  }, [isWarehousesSuccess, setFieldValue, warehouses]);
};
