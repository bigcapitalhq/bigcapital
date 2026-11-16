import moment from 'moment';
import React from 'react';
import {
  addSeries,
  agingSplit,
  alignPeriods,
  buildMonthWindow,
  deriveLockStates,
  effectiveLockDate,
  partialUnlockWindow,
  fiscalStartMonth,
  fiscalYearStartIndex,
  lastLockedMonth,
  readyToLockMonth,
  isThinMonth,
} from './overviewSeries';
import type {
  AgingSplit,
  AgingTotal,
  LockingSnapshot,
  MonthLockState,
  MonthlySeries,
  OverviewMonth,
  PeriodTotal,
} from './overviewSeries';
import type { ProfitLossJsonQuery } from '@bigcapital/sdk-ts';
import {
  AbilitySubject,
  CashflowAction,
  ReportsAction,
} from '@/constants/abilityOption';
import { useAbilityContext } from '@/hooks';
import {
  useAPAgingSummaryJson,
  useARAgingSummaryJson,
  useCashflowAccounts,
  useCurrentOrganization,
  useProfitLossSheetJson,
  useSettingsOrganization,
  useTransactionsLocking,
} from '@/hooks/query';

export type PanelStatus = 'loading' | 'error' | 'ready' | 'hidden';

interface QueryLike {
  isLoading: boolean;
  isError: boolean;
  refetch: () => unknown;
}

export interface PanelState<T> {
  status: PanelStatus;
  data: T | null;
  retry: () => void;
}

/** A P&L report node as returned by the JSON (not table) endpoint. */
interface ReportNode {
  id?: string | number;
  name?: string;
  horizontalTotals?: PeriodTotal[];
  children?: ReportNode[];
}

export interface RankedAccount {
  id: string;
  name: string;
  /** Monthly series for this account across the window. */
  series: MonthlySeries;
}

export interface ProfitLossData {
  income: MonthlySeries;
  costOfGoods: MonthlySeries;
  grossProfit: MonthlySeries;
  expenses: MonthlySeries;
  otherIncome: MonthlySeries;
  otherExpenses: MonthlySeries;
  netIncome: MonthlySeries;
  /** Cost of goods plus expenses plus other expenses. */
  spend: MonthlySeries;
  expenseAccounts: RankedAccount[];
}

export interface CashAccount {
  id: number;
  name: string;
  amount: number;
}

export interface CashData {
  total: number;
  accounts: CashAccount[];
  uncategorizedCount: number;
  /** Set when exactly one account has uncategorized transactions. */
  uncategorizedAccountId: number | null;
}

export interface LockData {
  lockedThrough: string | null;
  states: MonthLockState[];
  readyMonth: OverviewMonth | null;
  /** The latest ended month when it records too little to offer locking. */
  thinMonth: OverviewMonth | null;
  /** Locked months a partial unlock has opened for changes. */
  reopened: OverviewMonth[];
  lastLocked: OverviewMonth | null;
  /** Locking every module at once is safe to offer from the homepage. */
  canLockAll: boolean;
}

export interface OverviewData {
  today: string;
  months: OverviewMonth[];
  fiscalStartIndex: number;
  priorYear: number;
  currencyCode: string;
  basis: 'cash' | 'accrual';
  lock: PanelState<LockData>;
  profitLoss: PanelState<ProfitLossData>;
  cash: PanelState<CashData>;
  receivable: PanelState<AgingSplit>;
  payable: PanelState<AgingSplit>;
}

const AGING_QUERY_DAYS = 30;
const AGING_QUERY_PERIODS = 2;
const CASH_ACCOUNT_TYPES = new Set(['bank', 'cash']);

function panelState<T>(
  allowed: boolean,
  query: QueryLike,
  data: T | null,
): PanelState<T> {
  const retry = () => {
    query.refetch();
  };
  if (!allowed) return { status: 'hidden', data: null, retry };
  if (query.isError) return { status: 'error', data: null, retry };
  if (query.isLoading || data === null) {
    return { status: 'loading', data: null, retry };
  }
  return { status: 'ready', data, retry };
}

function findNode(
  nodes: ReportNode[] | undefined,
  id: string,
): ReportNode | undefined {
  return nodes?.find((node) => node.id === id);
}

function toProfitLoss(
  nodes: ReportNode[] | undefined,
  monthCount: number,
): ProfitLossData {
  const series = (id: string) =>
    alignPeriods(findNode(nodes, id)?.horizontalTotals, monthCount);

  const costOfGoods = series('COST_OF_SALES');
  const expenses = series('EXPENSES');
  const otherExpenses = series('OTHER_EXPENSES');
  const expenseAccounts = (findNode(nodes, 'EXPENSES')?.children ?? []).map(
    (child, index) => ({
      id: String(child.id ?? index),
      name: child.name ?? '',
      series: alignPeriods(child.horizontalTotals, monthCount),
    }),
  );

  return {
    income: series('INCOME'),
    costOfGoods,
    grossProfit: series('GROSS_PROFIT'),
    expenses,
    otherIncome: series('OTHER_INCOME'),
    otherExpenses,
    netIncome: series('NET_INCOME'),
    spend: addSeries(costOfGoods, expenses, otherExpenses),
    expenseAccounts,
  };
}

interface BankAccountRow {
  id: number;
  name: string;
  accountType?: string;
  currencyCode?: string;
  amount?: number | null;
  uncategorizedTransactionsCount?: number | null;
}

function toCash(
  rows: BankAccountRow[] | undefined,
  currencyCode: string,
): CashData {
  const all = rows ?? [];
  // balances in other currencies are not summed into the base currency.
  const accounts = all
    .filter(
      (row) =>
        CASH_ACCOUNT_TYPES.has(String(row.accountType)) &&
        (!row.currencyCode || row.currencyCode === currencyCode),
    )
    .map((row) => ({ id: row.id, name: row.name, amount: row.amount ?? 0 }))
    .sort((a, b) => b.amount - a.amount);

  const withUncategorized = all.filter(
    (row) => (row.uncategorizedTransactionsCount ?? 0) > 0,
  );
  return {
    total: accounts.reduce((sum, account) => sum + account.amount, 0),
    accounts,
    uncategorizedCount: withUncategorized.reduce(
      (sum, row) => sum + (row.uncategorizedTransactionsCount ?? 0),
      0,
    ),
    uncategorizedAccountId:
      withUncategorized.length === 1 ? withUncategorized[0].id : null,
  };
}

/**
 * Loads everything the overview shows from existing report endpoints: one
 * monthly P&L with previous-year columns (which also yields year to date),
 * A/R and A/P aging, bank account balances and the transactions lock date.
 */
export function useOverviewData(): OverviewData {
  // fixed for the life of the page so every panel agrees on "today".
  const [today] = React.useState(() => moment().format('YYYY-MM-DD'));
  const months = React.useMemo(() => buildMonthWindow(today), [today]);

  const ability = useAbilityContext();
  const canReadProfitLoss = ability.can(
    ReportsAction.READ_PROFIT_LOSS,
    AbilitySubject.Report,
  );
  const canReadReceivable = ability.can(
    ReportsAction.READ_AR_AGING_SUMMARY,
    AbilitySubject.Report,
  );
  const canReadPayable = ability.can(
    ReportsAction.READ_AP_AGING_SUMMARY,
    AbilitySubject.Report,
  );
  const canViewCash = ability.can(CashflowAction.View, AbilitySubject.Cashflow);

  const { data: organization } = useCurrentOrganization();
  const metadata = organization?.metadata;
  const currencyCode = metadata?.baseCurrency ?? '';
  const fiscalStartIndex = fiscalYearStartIndex(
    months,
    fiscalStartMonth(metadata?.fiscalYear),
  );

  // wait for the basis so the report is not fetched twice on load.
  const settings = useSettingsOrganization();
  const basis = settings.data?.accountingBasis === 'cash' ? 'cash' : 'accrual';
  const isBasisKnown = settings.isSuccess || settings.isError;

  // the generated query type omits the date range, as the P&L page notes.
  const profitLossQuery = useProfitLossSheetJson(
    {
      basis,
      fromDate: months[0].start,
      toDate: today,
      displayColumnsType: 'date_periods',
      displayColumnsBy: 'month',
      previousYear: true,
    } as ProfitLossJsonQuery,
    { enabled: canReadProfitLoss && isBasisKnown },
  );
  const agingQuery = {
    asDate: today,
    agingDaysBefore: AGING_QUERY_DAYS,
    agingPeriods: AGING_QUERY_PERIODS,
  };
  const receivableQuery = useARAgingSummaryJson(agingQuery, {
    enabled: canReadReceivable,
  });
  const payableQuery = useAPAgingSummaryJson(agingQuery, {
    enabled: canReadPayable,
  });
  const accountsQuery = useCashflowAccounts({}, { enabled: canViewCash });
  const lockingQuery = useTransactionsLocking();

  const profitLoss = React.useMemo(() => {
    const response = profitLossQuery.data as
      | { data?: ReportNode[] }
      | undefined;
    return response ? toProfitLoss(response.data, months.length) : null;
  }, [profitLossQuery.data, months.length]);

  const receivable = React.useMemo(() => {
    const response = receivableQuery.data as
      | { data?: { total?: AgingTotal } }
      | undefined;
    return response ? agingSplit(response.data?.total) : null;
  }, [receivableQuery.data]);

  const payable = React.useMemo(() => {
    const response = payableQuery.data as
      | { data?: { total?: AgingTotal } }
      | undefined;
    return response ? agingSplit(response.data?.total) : null;
  }, [payableQuery.data]);

  const cash = React.useMemo(() => {
    const rows = accountsQuery.data as unknown as BankAccountRow[] | undefined;
    return rows ? toCash(rows, currencyCode) : null;
  }, [accountsQuery.data, currencyCode]);

  const lock = React.useMemo(() => {
    const locking = lockingQuery.data as LockingSnapshot | undefined;
    if (!locking) return null;
    // wait for the P&L so the lock offer does not appear and then vanish.
    const isProfitLossPending =
      canReadProfitLoss && profitLoss === null && !profitLossQuery.isError;
    if (isProfitLossPending) return null;

    const lockedThrough = effectiveLockDate(locking);
    const unlock = partialUnlockWindow(locking);
    const states = deriveLockStates(months, lockedThrough, unlock);
    const anyModuleLocked = (locking.modules ?? []).some((m) => m.isEnabled);

    // a month with almost nothing recorded is unfinished books, not a month to lock.
    const latestEnded = readyToLockMonth(months, states);
    const activity = profitLoss
      ? profitLoss.income.current.map(
          (amount, index) =>
            Math.abs(amount) + Math.abs(profitLoss.spend.current[index] ?? 0),
        )
      : null;
    const isThin =
      latestEnded !== null &&
      activity !== null &&
      isThinMonth(activity, months.indexOf(latestEnded));

    return {
      lockedThrough,
      states,
      readyMonth: isThin ? null : latestEnded,
      thinMonth: isThin ? latestEnded : null,
      reopened: months.filter((_, index) => states[index] === 'reopened'),
      lastLocked: lastLockedMonth(months, states),
      // locking 'all' replaces per-module locks, so only offer it when the
      // organization is not deliberately locking module by module.
      canLockAll: locking.lockingType === 'all' || !anyModuleLocked,
    };
  }, [
    lockingQuery.data,
    months,
    canReadProfitLoss,
    profitLoss,
    profitLossQuery.isError,
  ]);

  return {
    today,
    months,
    fiscalStartIndex,
    priorYear: Number(today.slice(0, 4)) - 1,
    currencyCode,
    basis,
    lock: panelState(true, lockingQuery, lock),
    profitLoss: panelState(canReadProfitLoss, profitLossQuery, profitLoss),
    cash: panelState(canViewCash, accountsQuery, cash),
    receivable: panelState(canReadReceivable, receivableQuery, receivable),
    payable: panelState(canReadPayable, payableQuery, payable),
  };
}
