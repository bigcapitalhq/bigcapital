import React from 'react';
import moment from 'moment';
import intl from 'react-intl-universal';
import { useFormikContext } from 'formik';
import { Intent } from '@blueprintjs/core';
import { omit } from 'lodash';

import {
  compose,
  transformToForm,
  repeatValue,
  transactionNumber,
  defaultFastFieldShouldUpdate,
} from 'utils';
import { AppToaster } from 'components';
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
  invoice_date: moment(new Date()).format('YYYY-MM-DD'),
  invoice_no: '',
  invoice_no_manually: false,
  reference_no: '',
  invoice_message: '',
  terms_conditions: '',
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
  const entries = compose(
    ensureEntriesHaveEmptyLine(defaultCreditNoteEntry),
    updateItemsEntriesTotal,
  )(initialEntries);

  return {
    ...transformToForm(creditNote, defaultCreditNote),
    entries,
  };
}

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
