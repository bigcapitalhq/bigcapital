import React from 'react';
import { Intent } from '@blueprintjs/core';
import { sumBy, setWith, toSafeInteger, get, values } from 'lodash';
import moment from 'moment';

import {
  transactionNumber,
  updateTableRow,
  repeatValue,
  transformToForm,
} from 'utils';
import { AppToaster } from 'components';
import { formatMessage } from 'services/intl';
import { useFormikContext } from 'formik';

const ERROR = {
  JOURNAL_NUMBER_ALREADY_EXISTS: 'JOURNAL.NUMBER.ALREADY.EXISTS',
  CUSTOMERS_NOT_WITH_RECEVIABLE_ACC: 'CUSTOMERS.NOT.WITH.RECEIVABLE.ACCOUNT',
  VENDORS_NOT_WITH_PAYABLE_ACCOUNT: 'VENDORS.NOT.WITH.PAYABLE.ACCOUNT',
  PAYABLE_ENTRIES_HAS_NO_VENDORS: 'PAYABLE.ENTRIES.HAS.NO.VENDORS',
  RECEIVABLE_ENTRIES_HAS_NO_CUSTOMERS: 'RECEIVABLE.ENTRIES.HAS.NO.CUSTOMERS',
  CREDIT_DEBIT_SUMATION_SHOULD_NOT_EQUAL_ZERO:
    'CREDIT.DEBIT.SUMATION.SHOULD.NOT.EQUAL.ZERO',
  ENTRIES_SHOULD_ASSIGN_WITH_CONTACT: 'ENTRIES_SHOULD_ASSIGN_WITH_CONTACT',
};

export const MIN_LINES_NUMBER = 4;

export const defaultEntry = {
  index: 0,
  account_id: '',
  credit: '',
  debit: '',
  contact_id: '',
  note: '',
};

export const defaultManualJournal = {
  journal_number: '',
  journal_type: 'Journal',
  date: moment(new Date()).format('YYYY-MM-DD'),
  description: '',
  reference: '',
  currency_code: '',
  publish: '',
  entries: [...repeatValue(defaultEntry, 4)],
};

// Transform to edit form.
export function transformToEditForm(manualJournal) {
  return {
    ...transformToForm(manualJournal, defaultManualJournal),
    entries: [
      ...manualJournal.entries.map((entry) => ({
        ...transformToForm(entry, defaultManualJournal.entries[0]),
      })),
      ...repeatValue(
        defaultEntry,
        Math.max(MIN_LINES_NUMBER - manualJournal.entries.length, 0),
      ),
    ],
  };
}

/**
 * Entries adjustment.
 */
function adjustmentEntries(entries) {
  const credit = sumBy(entries, (e) => toSafeInteger(e.credit));
  const debit = sumBy(entries, (e) => toSafeInteger(e.debit));

  return {
    debit: Math.max(credit - debit, 0),
    credit: Math.max(debit - credit, 0),
  };
}

/**
 * Adjustment credit/debit entries.
 * @param {number} rowIndex
 * @param {number} columnId
 * @param {string} value
 * @return {array}
 */
export const updateAdjustEntries = (rowIndex, columnId, value) => (rows) => {
  let newRows = [...rows];

  const oldCredit = get(rows, `[${rowIndex}].credit`);
  const oldDebit = get(rows, `[${rowIndex}].debit`);

  if (columnId === 'account_id' && !oldCredit && !oldDebit) {
    const adjustment = adjustmentEntries(rows);

    if (adjustment.credit) {
      newRows = updateTableRow(rowIndex, 'credit', adjustment.credit)(newRows);
    }
    if (adjustment.debit) {
      newRows = updateTableRow(rowIndex, 'debit', adjustment.debit)(newRows);
    }
  }
  return newRows;
};

/**
 * Transform API errors in toasts messages.
 */
export const transformErrors = (resErrors, { setErrors, errors }) => {
  const getError = (errorType) => resErrors.find((e) => e.type === errorType);
  const toastMessages = [];
  let error;
  let newErrors = { ...errors, entries: [] };

  const setEntriesErrors = (indexes, prop, message) =>
    indexes.forEach((i) => {
      const index = Math.max(i - 1, 0);
      newErrors = setWith(newErrors, `entries.[${index}].${prop}`, message);
    });

  if ((error = getError(ERROR.RECEIVABLE_ENTRIES_HAS_NO_CUSTOMERS))) {
    toastMessages.push(
      formatMessage({
        id: 'should_select_customers_with_entries_have_receivable_account',
      }),
    );
    setEntriesErrors(error.indexes, 'contact_id', 'error');
  }
  if ((error = getError(ERROR.ENTRIES_SHOULD_ASSIGN_WITH_CONTACT))) {
    if (error.meta.contact_type === 'customer') {
      toastMessages.push(
        formatMessage({
          id: 'receivable_accounts_should_assign_with_customers',
        }),
      );
    }
    if (error.meta.contact_type === 'vendor') {
      toastMessages.push(
        formatMessage({ id: 'payable_accounts_should_assign_with_vendors' }),
      );
    }
    setEntriesErrors(error.meta.indexes, 'contact_id', 'error');
  }
  if ((error = getError(ERROR.JOURNAL_NUMBER_ALREADY_EXISTS))) {
    newErrors = setWith(
      newErrors,
      'journal_number',
      formatMessage({
        id: 'journal_number_is_already_used',
      }),
    );
  }
  setErrors({ ...newErrors });

  if (toastMessages.length > 0) {
    AppToaster.show({
      message: toastMessages.map((message) => {
        return <div>- {message}</div>;
      }),
      intent: Intent.DANGER,
    });
  }
};

export const useObserveJournalNoSettings = (prefix, nextNumber) => {
  const { setFieldValue } = useFormikContext();

  React.useEffect(() => {
    const journalNo = transactionNumber(prefix, nextNumber);  
    setFieldValue('journal_number', journalNo);
  }, [setFieldValue, prefix, nextNumber]);
};
