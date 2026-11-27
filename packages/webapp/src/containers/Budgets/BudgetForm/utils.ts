import moment from 'moment';
import type { BudgetAccountRow, BudgetFormValues, BudgetPeriod } from './types';
import type { Account, Budget, BudgetPrefillEntry } from '@bigcapital/sdk-ts';
import { ACCOUNT_TYPES, ACCOUNT_ROOT_TYPE } from '@/constants/accountTypes';

const FISCAL_YEAR_MONTHS = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
];

const ENTRY_FIELD_SEPARATOR = '_';

/**
 * Builds the flat Formik field key of the given account and period.
 */
export function getEntryFieldKey(accountId: number, periodKey: string): string {
  return `${accountId}${ENTRY_FIELD_SEPARATOR}${periodKey}`;
}

/**
 * Parses the flat entry field key into its account ID and period key.
 */
export function parseEntryFieldKey(
  fieldKey: string,
): [number, string] | undefined {
  const separatorIndex = fieldKey.indexOf(ENTRY_FIELD_SEPARATOR);
  if (separatorIndex === -1) {
    return;
  }
  const accountId = Number(fieldKey.slice(0, separatorIndex));
  const periodKey = fieldKey.slice(separatorIndex + 1);

  if (!Number.isInteger(accountId) || !moment(periodKey, 'YYYY-MM').isValid()) {
    return;
  }
  return [accountId, periodKey];
}

/**
 * Retrieves the account root type from the account type key.
 */
export function getAccountRootType(accountType: string): string {
  return ACCOUNT_TYPES.find((type) => type.key === accountType)?.rootType ?? '';
}

/**
 * Determines whether the given account is a balance sheet account.
 */
export function isBalanceSheetAccount(account: {
  accountType: string;
}): boolean {
  const rootType = getAccountRootType(account.accountType);

  return (
    rootType === ACCOUNT_ROOT_TYPE.ASSET ||
    rootType === ACCOUNT_ROOT_TYPE.LIABILITY ||
    rootType === ACCOUNT_ROOT_TYPE.EQUITY
  );
}

/**
 * Retrieves the budget account rows sorted by account code.
 */
export function getBudgetAccountRows(accounts: Account[]): BudgetAccountRow[] {
  return accounts
    .filter((account) => account.active !== false)
    .map((account) => ({
      id: account.id,
      code: account.code ?? '',
      name: account.name,
      accountType: account.accountType,
      accountTypeLabel: account.accountTypeLabel ?? account.accountType,
      rootType: getAccountRootType(account.accountType),
      isBalanceSheet: isBalanceSheetAccount(account),
    }))
    .sort((a, b) => {
      return a.code.localeCompare(b.code, undefined, { numeric: true });
    });
}

/**
 * Retrieves the account rows visible in the budget form.
 */
export function getVisibleBudgetAccounts(
  accountRows: BudgetAccountRow[],
  includeBalanceSheetAccounts: boolean,
): BudgetAccountRow[] {
  return includeBalanceSheetAccounts
    ? accountRows
    : accountRows.filter((account) => !account.isBalanceSheet);
}

/**
 * Retrieves the fiscal year start month index from the organization setting.
 */
export function getFiscalYearStartMonth(fiscalYear?: string): number {
  const index = FISCAL_YEAR_MONTHS.indexOf(
    String(fiscalYear ?? 'january').toLowerCase(),
  );
  return index === -1 ? 0 : index;
}

/**
 * Retrieves the default budget period based on the organization fiscal year.
 */
export function getDefaultBudgetPeriod(fiscalYear?: string): {
  fromDate: Date;
  toDate: Date;
} {
  const startMonth = getFiscalYearStartMonth(fiscalYear);
  const now = moment();
  const startYear = now.month() < startMonth ? now.year() - 1 : now.year();

  const fromDate = moment({
    year: startYear,
    month: startMonth,
    day: 1,
  }).startOf('month');
  const toDate = fromDate
    .clone()
    .add(1, 'year')
    .subtract(1, 'month')
    .endOf('month');

  return {
    fromDate: fromDate.toDate(),
    toDate: toDate.toDate(),
  };
}

/**
 * Generates the monthly periods of the given budget date range.
 */
export function getBudgetPeriods(
  fromDate: Date | string | null | undefined,
  toDate: Date | string | null | undefined,
): BudgetPeriod[] {
  if (!fromDate || !toDate) {
    return [];
  }
  const startDate = moment(fromDate).startOf('month');
  const endDate = moment(toDate).endOf('month');

  if (!startDate.isValid() || !endDate.isValid()) {
    return [];
  }
  if (endDate.isBefore(startDate, 'month')) {
    return [];
  }
  const periods: BudgetPeriod[] = [];
  const cursor = startDate.clone();

  while (cursor.isSameOrBefore(endDate, 'month')) {
    periods.push({
      key: cursor.format('YYYY-MM'),
      label: cursor.format('MMM YYYY'),
      date: cursor.format('YYYY-MM-DD'),
    });
    cursor.add(1, 'month');
  }
  return periods;
}

/**
 * Builds the budget form initial values.
 */
export function getBudgetFormInitialValues(
  budget: Budget | undefined,
  accountRows: BudgetAccountRow[],
  fiscalYear?: string,
): BudgetFormValues {
  if (budget) {
    const entries = Object.fromEntries(
      budget.entries.map((entry) => [
        getEntryFieldKey(entry.accountId, moment(entry.date).format('YYYY-MM')),
        String(entry.amount),
      ]),
    );
    const balanceSheetAccountIds = new Set(
      accountRows
        .filter((account) => account.isBalanceSheet)
        .map((account) => account.id),
    );

    return {
      name: budget.name,
      description: budget.description ?? '',
      fromDate: moment(budget.fromDate).toDate(),
      toDate: moment(budget.toDate).toDate(),
      includeBalanceSheetAccounts: budget.entries.some((entry) =>
        balanceSheetAccountIds.has(entry.accountId),
      ),
      entries,
    };
  }
  const { fromDate, toDate } = getDefaultBudgetPeriod(fiscalYear);

  return {
    name: '',
    description: '',
    fromDate,
    toDate,
    includeBalanceSheetAccounts: false,
    entries: {},
  };
}

/**
 * Parses an amount input value into a number.
 */
export function parseAmount(value: string | number | null | undefined): number {
  if (value === null || value === undefined || value === '') {
    return 0;
  }
  const amount = typeof value === 'number' ? value : parseFloat(value);
  return Number.isFinite(amount) ? amount : 0;
}

/**
 * Sanitizes the amount input while the user is typing.
 */
export function sanitizeAmountInput(value: string): string {
  const cleaned = value.replace(/[^\d.]/g, '');
  const [integer, ...fraction] = cleaned.split('.');

  if (fraction.length === 0) {
    return integer;
  }
  return `${integer}.${fraction.join('').slice(0, 3)}`;
}

/**
 * Formats the amount input on blur.
 */
export function formatAmountInput(value: string | number | null | undefined) {
  const amount = parseAmount(value);
  if (amount === 0) {
    return '';
  }
  return String(Number(amount.toFixed(3)));
}

/**
 * Retrieves the total budgeted amount of the given account.
 */
export function getAccountEntriesTotal(
  values: BudgetFormValues,
  accountId: number,
  periods: BudgetPeriod[],
): number {
  return periods.reduce((total, period) => {
    return (
      total +
      parseAmount(values.entries[getEntryFieldKey(accountId, period.key)])
    );
  }, 0);
}

/**
 * Retrieves the totals of the budget form.
 */
export function getBudgetTotals(
  values: BudgetFormValues,
  accountRows: BudgetAccountRow[],
  periods: BudgetPeriod[],
): {
  total: number;
  income: number;
  expense: number;
  netProfit: number;
} {
  const accountsMap = new Map(
    accountRows.map((account) => [account.id, account]),
  );
  const periodKeys = new Set(periods.map((period) => period.key));

  let total = 0;
  let income = 0;
  let expense = 0;

  Object.entries(values.entries).forEach(([fieldKey, value]) => {
    const parsedKey = parseEntryFieldKey(fieldKey);
    if (!parsedKey || !periodKeys.has(parsedKey[1])) {
      return;
    }
    const [accountId] = parsedKey;
    const account = accountsMap.get(accountId);
    const amount = parseAmount(value);

    if (!account || amount <= 0) {
      return;
    }
    total += amount;

    if (account.rootType === ACCOUNT_ROOT_TYPE.INCOME) {
      income += amount;
    } else if (account.rootType === ACCOUNT_ROOT_TYPE.EXPENSE) {
      expense += amount;
    }
  });

  return {
    total,
    income,
    expense,
    netProfit: income - expense,
  };
}

/**
 * Applies the prefilled actual amounts to the form entries.
 */
export function applyPrefillEntries(
  values: BudgetFormValues,
  prefillEntries: BudgetPrefillEntry[],
  visibleAccounts: BudgetAccountRow[],
  periods: BudgetPeriod[],
  adjustmentPercentage: number,
): Record<string, string> {
  const nextEntries = { ...values.entries };
  const accountsIds = new Set(visibleAccounts.map((account) => account.id));
  const periodsKeys = new Set(periods.map((period) => period.key));

  // Clears the currently visible cells so stale values are not kept after
  // prefilling from a different source year.
  visibleAccounts.forEach((account) => {
    periods.forEach((period) => {
      delete nextEntries[getEntryFieldKey(account.id, period.key)];
    });
  });

  const factor = 1 + adjustmentPercentage / 100;

  prefillEntries.forEach((entry) => {
    const periodKey = moment(entry.date).format('YYYY-MM');

    if (!accountsIds.has(entry.accountId) || !periodsKeys.has(periodKey)) {
      return;
    }
    const amount = entry.amount * factor;
    if (amount <= 0) {
      return;
    }
    nextEntries[getEntryFieldKey(entry.accountId, periodKey)] = String(
      Number(amount.toFixed(3)),
    );
  });

  return nextEntries;
}

/**
 * Transforms the budget form values to the create/edit request body.
 */
export function transformBudgetFormToRequest(
  values: BudgetFormValues,
  visibleAccounts: BudgetAccountRow[],
  periods: BudgetPeriod[],
): {
  name: string;
  description?: string;
  fromDate: string;
  toDate: string;
  entries: Array<{ accountId: number; date: string; amount: number }>;
} {
  const accountsIds = new Set(visibleAccounts.map((account) => account.id));
  const periodsMap = new Map(periods.map((period) => [period.key, period]));

  const entries = Object.entries(values.entries).flatMap(
    ([fieldKey, value]) => {
      const parsedKey = parseEntryFieldKey(fieldKey);
      if (!parsedKey) {
        return [];
      }
      const [accountId, periodKey] = parsedKey;
      const period = periodsMap.get(periodKey);
      const amount = Number(parseAmount(value).toFixed(3));

      if (!period || !accountsIds.has(accountId) || amount <= 0) {
        return [];
      }
      return [
        {
          accountId,
          date: period.date,
          amount,
        },
      ];
    },
  );

  return {
    name: values.name.trim(),
    description: values.description.trim() || undefined,
    fromDate: moment(values.fromDate).format('YYYY-MM-DD'),
    toDate: moment(values.toDate).format('YYYY-MM-DD'),
    entries,
  };
}
