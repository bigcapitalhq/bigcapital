// @ts-nocheck
import React from 'react';
import * as R from 'ramda';
import moment from 'moment';
import intl from 'react-intl-universal';
import { Intent } from '@blueprintjs/core';
import { sumBy, setWith, toSafeInteger, get, first } from 'lodash';
import {
  updateTableCell,
  repeatValue,
  transformToForm,
  defaultFastFieldShouldUpdate,
  ensureEntriesHasEmptyLine,
  formattedAmount,
  safeSumBy,
} from '@/utils';
import { AppToaster } from '@/components';
import { useFormikContext } from 'formik';
import { useMakeJournalFormContext } from './MakeJournalProvider';
import { useCurrentOrganization } from '@/hooks/state';

const ERROR = {
  JOURNAL_NUMBER_ALREADY_EXISTS: 'JOURNAL.NUMBER.ALREADY.EXISTS',
  CUSTOMERS_NOT_WITH_RECEIVABLE_ACC: 'CUSTOMERS.NOT.WITH.RECEIVABLE.ACCOUNT',
  VENDORS_NOT_WITH_PAYABLE_ACCOUNT: 'VENDORS.NOT.WITH.PAYABLE.ACCOUNT',
  PAYABLE_ENTRIES_HAS_NO_VENDORS: 'PAYABLE.ENTRIES.HAS.NO.VENDORS',
  RECEIVABLE_ENTRIES_HAS_NO_CUSTOMERS: 'RECEIVABLE.ENTRIES.HAS.NO.CUSTOMERS',
  CREDIT_DEBIT_SUMATION_SHOULD_NOT_EQUAL_ZERO:
    'CREDIT.DEBIT.SUMATION.SHOULD.NOT.EQUAL.ZERO',
  ENTRIES_SHOULD_ASSIGN_WITH_CONTACT: 'ENTRIES_SHOULD_ASSIGN_WITH_CONTACT',
  COULD_NOT_ASSIGN_DIFFERENT_CURRENCY_TO_ACCOUNTS:
    'COULD_NOT_ASSIGN_DIFFERENT_CURRENCY_TO_ACCOUNTS',
};

export const MIN_LINES_NUMBER = 1;
export const DEFAULT_LINES_NUMBER = 1;

export const defaultEntry = {
  account_id: '',
  credit: '',
  debit: '',
  contact_id: '',
  branch_id: '',
  project_id: '',
  note: '',
};

export const defaultManualJournal = {
  journal_number: '',
  journal_number_manually: '',
  journal_type: 'Journal',
  date: moment(new Date()).format('YYYY-MM-DD'),
  description: '',
  reference: '',
  currency_code: '',
  publish: '',
  branch_id: '',
  exchange_rate: 1,
  entries: [...repeatValue(defaultEntry, DEFAULT_LINES_NUMBER)],
};

// Transform to edit form.
export function transformToEditForm(manualJournal) {
  const defaultEntry = defaultManualJournal.entries[0];
  const initialEntries = [
    ...manualJournal.entries.map((entry) => ({
      ...transformToForm(entry, defaultEntry),
    })),
    ...repeatValue(
      defaultEntry,
      Math.max(MIN_LINES_NUMBER - manualJournal.entries.length, 0),
    ),
  ];

  const entries = R.compose(
    ensureEntriesHasEmptyLine(MIN_LINES_NUMBER, defaultEntry),
  )(initialEntries);

  return {
    ...transformToForm(manualJournal, defaultManualJournal),
    entries,
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
      newRows = updateTableCell(rowIndex, 'credit', adjustment.credit)(newRows);
    }
    if (adjustment.debit) {
      newRows = updateTableCell(rowIndex, 'debit', adjustment.debit)(newRows);
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
      intl.get('should_select_customers_with_entries_have_receivable_account'),
    );
    setEntriesErrors(error.indexes, 'contact_id', 'error');
  }
  if ((error = getError(ERROR.ENTRIES_SHOULD_ASSIGN_WITH_CONTACT))) {
    if (error.meta.find((meta) => meta.contact_type === 'customer')) {
      toastMessages.push(
        intl.get('receivable_accounts_should_assign_with_customers'),
      );
    }
    if (error.meta.find((meta) => meta.contact_type === 'vendor')) {
      toastMessages.push(
        intl.get('payable_accounts_should_assign_with_vendors'),
      );
    }
    const indexes = error.meta.map((meta) => meta.indexes).flat();
    setEntriesErrors(indexes, 'contact_id', 'error');
  }
  if ((error = getError(ERROR.JOURNAL_NUMBER_ALREADY_EXISTS))) {
    newErrors = setWith(
      newErrors,
      'journal_number',
      intl.get('journal_number_is_already_used'),
    );
  }
  if (
    (error = getError(ERROR.COULD_NOT_ASSIGN_DIFFERENT_CURRENCY_TO_ACCOUNTS))
  ) {
    toastMessages.push(
      intl.get(
        'make_journal.errors.should_add_accounts_in_same_currency_or_base_currency',
      ),
    );
  }
  setErrors({ ...newErrors });

  if (toastMessages.length > 0) {
    AppToaster.show({
      message: toastMessages.map((message) => {
        return <div>{message}</div>;
      }),
      intent: Intent.DANGER,
    });
  }
};

/**
 * Determines entries fast field should update.
 */
export const entriesFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.accounts !== oldProps.accounts ||
    newProps.contacts !== oldProps.contacts ||
    newProps.branches !== oldProps.branches ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

/**
 * Determines currencies fast field should update.
 */
export const currenciesFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.currencies !== oldProps.currencies ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

export const useSetPrimaryBranchToForm = () => {
  const { setFieldValue } = useFormikContext();
  const { branches, isBranchesSuccess } = useMakeJournalFormContext();

  React.useEffect(() => {
    if (isBranchesSuccess) {
      const primaryBranch = branches.find((b) => b.primary) || first(branches);

      if (primaryBranch) {
        setFieldValue('branch_id', primaryBranch.id);
      }
    }
  }, [isBranchesSuccess, setFieldValue, branches]);
};

/**
 * Retreives the Journal totals.
 */
export const useJournalTotals = () => {
  const {
    values: { entries, currency_code: currencyCode },
  } = useFormikContext();

  // Retrieves the invoice entries total.
  const totalCredit = safeSumBy(entries, 'credit');
  const totalDebit = safeSumBy(entries, 'debit');

  const total = Math.max(totalCredit, totalDebit);
  // Retrieves the formatted total money.
  const formattedTotal = React.useMemo(
    () => formattedAmount(total, currencyCode),
    [total, currencyCode],
  );
  // Retrieves the formatted subtotal.
  const formattedSubtotal = React.useMemo(
    () => formattedAmount(total, currencyCode, { money: false }),
    [total, currencyCode],
  );

  return {
    formattedTotal,
    formattedSubtotal,
  };
};

/**
 * Determines whether the expenses has foreign .
 * @returns {boolean}
 */
export const useJournalIsForeign = () => {
  const { values } = useFormikContext();
  const currentOrganization = useCurrentOrganization();

  const isForeignJournal = React.useMemo(
    () => values.currency_code !== currentOrganization.base_currency,
    [values.currency_code, currentOrganization.base_currency],
  );
  return isForeignJournal;
};
