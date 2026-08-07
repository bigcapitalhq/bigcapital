import { Intent } from '@blueprintjs/core';
import { useFormikContext, type FormikErrors } from 'formik';
import { sumBy, setWith, get, first, toNumber, omit } from 'lodash';
import moment from 'moment';
import React from 'react';
import intl from 'react-intl-universal';
import { useMakeJournalFormContext } from './MakeJournalProvider';
import type {
  ManualJournal,
  CreateManualJournalBody,
} from '@bigcapital/sdk-ts';
import { AppToaster } from '@/components';
import {
  transformAttachmentsToForm,
  transformAttachmentsToRequest,
} from '@/containers/Attachments/utils';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';
import {
  updateTableCell,
  repeatValue,
  transformToForm,
  defaultFastFieldShouldUpdate,
  ensureEntriesHasEmptyLine,
  formattedAmount,
  safeSumBy,
  orderingLinesIndexes,
} from '@/utils';

const ERROR = {
  JOURNAL_NUMBER_ALREADY_EXISTS: 'JOURNAL.NUMBER.ALREADY.EXISTS',
  CUSTOMERS_NOT_WITH_RECEVIABLE_ACC: 'CUSTOMERS.NOT.WITH.RECEIVABLE.ACCOUNT',
  VENDORS_NOT_WITH_PAYABLE_ACCOUNT: 'VENDORS.NOT.WITH.PAYABLE.ACCOUNT',
  PAYABLE_ENTRIES_HAS_NO_VENDORS: 'PAYABLE.ENTRIES.HAS.NO.VENDORS',
  RECEIVABLE_ENTRIES_HAS_NO_CUSTOMERS: 'RECEIVABLE.ENTRIES.HAS.NO.CUSTOMERS',
  CREDIT_DEBIT_SUMATION_SHOULD_NOT_EQUAL_ZERO:
    'CREDIT.DEBIT.SUMATION.SHOULD.NOT.EQUAL.ZERO',
  ENTRIES_SHOULD_ASSIGN_WITH_CONTACT: 'ENTRIES_SHOULD_ASSIGN_WITH_CONTACT',
  COULD_NOT_ASSIGN_DIFFERENT_CURRENCY_TO_ACCOUNTS:
    'COULD_NOT_ASSIGN_DIFFERENT_CURRENCY_TO_ACCOUNTS',
} as const;

export const MIN_LINES_NUMBER = 1;
export const DEFAULT_LINES_NUMBER = 1;

export type MakeJournalEntry = {
  accountId: string | number;
  credit: string | number;
  debit: string | number;
  contactId: string | number;
  branchId: string | number;
  projectId: string | number;
  note: string;
};

export type MakeJournalFormValues = {
  journalNumber: string;
  journalNumberManually: string;
  journalType: string;
  date: string;
  description: string;
  reference: string;
  currencyCode: string;
  publish: '' | boolean;
  branchId: string | number;
  exchangeRate: number;
  entries: MakeJournalEntry[];
  attachments: unknown[];
};

export type MakeJournalErrorResponse = {
  type: string;
  indexes?: number[];
  meta?: { contact_type?: string; indexes?: number[] }[];
};

export const defaultEntry: MakeJournalEntry = {
  accountId: '',
  credit: '',
  debit: '',
  contactId: '',
  branchId: '',
  projectId: '',
  note: '',
};

export const defaultManualJournal: MakeJournalFormValues = {
  journalNumber: '',
  journalNumberManually: '',
  journalType: 'Journal',
  date: moment(new Date()).format('YYYY-MM-DD'),
  description: '',
  reference: '',
  currencyCode: '',
  publish: '',
  branchId: '',
  exchangeRate: 1,
  entries: [...repeatValue(defaultEntry, DEFAULT_LINES_NUMBER)],
  attachments: [],
};

// Transform to edit form.
export function transformToEditForm(
  manualJournal: ManualJournal,
): MakeJournalFormValues {
  const initialEntries: MakeJournalEntry[] = [
    ...manualJournal.entries.map((entry) => ({
      ...transformToForm(entry, defaultEntry),
    })),
    ...repeatValue(
      defaultEntry,
      Math.max(MIN_LINES_NUMBER - manualJournal.entries.length, 0),
    ),
  ];

  const entries = ensureEntriesHasEmptyLine(
    MIN_LINES_NUMBER,
    defaultEntry,
  )(initialEntries);

  const attachments = transformAttachmentsToForm(manualJournal);

  return {
    ...transformToForm(manualJournal, defaultManualJournal),
    entries,
    attachments,
  } as MakeJournalFormValues;
}

/**
 * Transform form values to the create/edit request body.
 */
export function transformFormValuesToRequest(
  values: MakeJournalFormValues,
  publish: boolean,
): CreateManualJournalBody {
  const nonZeroEntries = values.entries.filter(
    (entry) => entry.debit || entry.credit,
  );
  const entries = orderingLinesIndexes(nonZeroEntries);
  const attachments = transformAttachmentsToRequest(values);

  return {
    ...omit(values, ['journalNumberManually', 'entries', 'attachments']),
    ...(values.journalNumberManually && {
      journalNumber: values.journalNumber,
    }),
    branchId: values.branchId === '' ? undefined : Number(values.branchId),
    publish,
    entries,
    attachments,
  };
}

/**
 * Entries adjustment.
 */
function adjustmentEntries(entries: MakeJournalEntry[]): {
  debit: number;
  credit: number;
} {
  const credit = sumBy(entries, (e) => toNumber(e.credit));
  const debit = sumBy(entries, (e) => toNumber(e.debit));

  return {
    debit: Math.max(credit - debit, 0),
    credit: Math.max(debit - credit, 0),
  };
}

/**
 * Adjustment credit/debit entries.
 */
export const updateAdjustEntries =
  (rowIndex: number, columnId: string, value: string | number) =>
  (rows: MakeJournalEntry[]): MakeJournalEntry[] => {
    let newRows = [...rows];

    const oldCredit = get(rows, `[${rowIndex}].credit`);
    const oldDebit = get(rows, `[${rowIndex}].debit`);

    if (columnId === 'accountId' && !oldCredit && !oldDebit) {
      const adjustment = adjustmentEntries(rows);

      if (adjustment.credit) {
        newRows = updateTableCell(
          rowIndex,
          'credit',
          adjustment.credit,
        )(newRows);
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
export const transformErrors = (
  resErrors: MakeJournalErrorResponse[],
  {
    setErrors,
    errors,
  }: {
    setErrors: (errors: FormikErrors<MakeJournalFormValues>) => void;
    errors?: FormikErrors<MakeJournalFormValues>;
  },
): void => {
  const getError = (errorType: string) =>
    resErrors.find((e) => e.type === errorType);
  const toastMessages: React.ReactNode[] = [];
  let error: MakeJournalErrorResponse | undefined;
  let newErrors: FormikErrors<MakeJournalFormValues> = {
    ...errors,
    entries: [],
  };

  const setEntriesErrors = (indexes: number[], prop: string, message: string) =>
    indexes.forEach((i) => {
      const index = Math.max(i - 1, 0);
      newErrors = setWith(newErrors, `entries.[${index}].${prop}`, message);
    });

  if ((error = getError(ERROR.RECEIVABLE_ENTRIES_HAS_NO_CUSTOMERS))) {
    toastMessages.push(
      intl.get('should_select_customers_with_entries_have_receivable_account'),
    );
    setEntriesErrors(error.indexes ?? [], 'contactId', 'error');
  }
  if ((error = getError(ERROR.ENTRIES_SHOULD_ASSIGN_WITH_CONTACT))) {
    if (error.meta?.find((meta) => meta.contact_type === 'customer')) {
      toastMessages.push(
        intl.get('receivable_accounts_should_assign_with_customers'),
      );
    }
    if (error.meta?.find((meta) => meta.contact_type === 'vendor')) {
      toastMessages.push(
        intl.get('payable_accounts_should_assign_with_vendors'),
      );
    }
    const indexes = (error.meta ?? []).map((meta) => meta.indexes ?? []).flat();
    setEntriesErrors(indexes, 'contactId', 'error');
  }
  if ((error = getError(ERROR.JOURNAL_NUMBER_ALREADY_EXISTS))) {
    newErrors = setWith(
      newErrors,
      'journalNumber',
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
      message: toastMessages.map((message, index) => {
        return <div key={index}>{message}</div>;
      }),
      intent: Intent.DANGER,
    });
  }
};

type EntriesFieldShouldUpdateProps = {
  accounts?: unknown[];
  contacts?: unknown[];
  branches?: unknown[];
  shouldUpdateDeps?: {
    accounts?: unknown[];
    contacts?: unknown[];
    branches?: unknown[];
  };
};

/**
 * Detarmines entries fast field should update.
 */
export const entriesFieldShouldUpdate = (
  newProps: EntriesFieldShouldUpdateProps,
  oldProps: EntriesFieldShouldUpdateProps,
): boolean => {
  return (
    newProps.accounts !== oldProps.accounts ||
    newProps.contacts !== oldProps.contacts ||
    newProps.branches !== oldProps.branches ||
    (defaultFastFieldShouldUpdate(newProps, oldProps) as boolean)
  );
};

type CurrenciesFieldShouldUpdateProps = {
  currencies?: unknown[];
  shouldUpdateDeps?: { currencies?: unknown[] };
};

/**
 * Detarmines currencies fast field should update.
 */
export const currenciesFieldShouldUpdate = (
  newProps: CurrenciesFieldShouldUpdateProps,
  oldProps: CurrenciesFieldShouldUpdateProps,
): boolean => {
  return (
    newProps.currencies !== oldProps.currencies ||
    (defaultFastFieldShouldUpdate(newProps, oldProps) as boolean)
  );
};

export const useSetPrimaryBranchToForm = () => {
  const { setFieldValue } = useFormikContext<MakeJournalFormValues>();
  const { branches, isBranchesSuccess, isNewMode } =
    useMakeJournalFormContext();

  React.useEffect(() => {
    if (isBranchesSuccess && isNewMode) {
      const primaryBranch = branches.find((b) => b.primary) || first(branches);

      if (primaryBranch) {
        setFieldValue('branchId', primaryBranch.id);
      }
    }
  }, [isBranchesSuccess, setFieldValue, branches, isNewMode]);
};

export const useManualJournalCreditTotal = (): number => {
  const { values } = useFormikContext<MakeJournalFormValues>();
  const totalCredit = safeSumBy(values.entries, 'credit');

  return totalCredit;
};

export const useManualJournalCreditTotalFormatted = (): string => {
  const totalCredit = useManualJournalCreditTotal();
  const { values } = useFormikContext<MakeJournalFormValues>();

  return formattedAmount(totalCredit, values.currencyCode);
};

export const useManualJournalDebitTotal = (): number => {
  const { values } = useFormikContext<MakeJournalFormValues>();
  const totalDebit = safeSumBy(values.entries, 'debit');

  return totalDebit;
};

export const useManualJournalDebitTotalFormatted = (): string => {
  const totalDebit = useManualJournalDebitTotal();
  const { values } = useFormikContext<MakeJournalFormValues>();

  return formattedAmount(totalDebit, values.currencyCode);
};

export const useManualJournalSubtotal = (): number => {
  const totalCredit = useManualJournalCreditTotal();
  const totalDebit = useManualJournalDebitTotal();

  return Math.max(totalCredit, totalDebit);
};

export const useManualJournalSubtotalFormatted = (): string => {
  const subtotal = useManualJournalSubtotal();
  const { values } = useFormikContext<MakeJournalFormValues>();

  return formattedAmount(subtotal, values.currencyCode);
};

export const useManualJournalTotalDifference = (): number => {
  const totalCredit = useManualJournalCreditTotal();
  const totalDebit = useManualJournalDebitTotal();

  return Math.abs(totalCredit - totalDebit);
};

export const useManualJournalTotalDifferenceFormatted = (): string => {
  const difference = useManualJournalTotalDifference();
  const { values } = useFormikContext<MakeJournalFormValues>();

  return formattedAmount(difference, values.currencyCode);
};

export const useManualJournalTotal = (): number => {
  const total = useManualJournalSubtotal();

  return total;
};

export const useManualJournalTotalFormatted = (): string => {
  const total = useManualJournalTotal();
  const { values } = useFormikContext<MakeJournalFormValues>();

  return formattedAmount(total, values.currencyCode);
};

/**
 * Detarmines whether the journal has foreign currency.
 */
export const useJournalIsForeign = (): boolean => {
  const { values } = useFormikContext<MakeJournalFormValues>();
  const baseCurrency = useCurrentOrganizationBaseCurrency();

  const isForeignJournal = React.useMemo(
    () => values.currencyCode !== baseCurrency,
    [values.currencyCode, baseCurrency],
  );
  return isForeignJournal;
};
