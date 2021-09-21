import React from 'react';
import { useFormikContext } from 'formik';
import moment from 'moment';
import * as R from 'ramda';
import {
  defaultFastFieldShouldUpdate,
  transactionNumber,
  repeatValue,
  transformToForm,
} from 'utils';
import {
  updateItemsEntriesTotal,
  ensureEntriesHaveEmptyLine,
} from 'containers/Entries/utils';

export const MIN_LINES_NUMBER = 4;

export const defaultEstimateEntry = {
  index: 0,
  item_id: '',
  rate: '',
  discount: '',
  quantity: '',
  description: '',
  amount: '',
};

export const defaultEstimate = {
  customer_id: '',
  estimate_date: moment(new Date()).format('YYYY-MM-DD'),
  expiration_date: moment(new Date()).format('YYYY-MM-DD'),
  estimate_number: '',
  delivered: '',
  reference: '',
  note: '',
  terms_conditions: '',
  entries: [...repeatValue(defaultEstimateEntry, MIN_LINES_NUMBER)],
};

export const transformToEditForm = (estimate) => {
  const initialEntries = [
    ...estimate.entries.map((estimate) => ({
      ...transformToForm(estimate, defaultEstimateEntry),
    })),
    ...repeatValue(
      defaultEstimateEntry,
      Math.max(MIN_LINES_NUMBER - estimate.entries.length, 0),
    ),
  ];
  const entries = R.compose(
    ensureEntriesHaveEmptyLine(defaultEstimateEntry),
    updateItemsEntriesTotal,
  )(initialEntries);

  return {
    ...transformToForm(estimate, defaultEstimate),
    entries
  }
};

/**
 * Syncs estimate number of the settings with the context form.
 */
export const useObserveEstimateNoSettings = (prefix, nextNumber) => {
  const { setFieldValue } = useFormikContext();

  React.useEffect(() => {
    const estimateNo = transactionNumber(prefix, nextNumber);
    setFieldValue('estimate_number', estimateNo);
  }, [setFieldValue, prefix, nextNumber]);
};

/**
 * Detarmines customers fast field when update.
 */
export const customersFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.customers !== oldProps.customers ||
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

export const ITEMS_FILTER_ROLES = JSON.stringify([
  {
    index: 1,
    fieldKey: 'sellable',
    value: true,
    condition: '&&',
    comparator: 'equals',
  },
  {
    index: 2,
    fieldKey: 'active',
    value: true,
    condition: '&&',
    comparator: 'equals',
  },
]);
