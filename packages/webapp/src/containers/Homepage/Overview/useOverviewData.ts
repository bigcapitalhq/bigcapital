import moment from 'moment';
import React from 'react';
import {
  accountsDifferingFromBank,
  billsDueSoon,
  chargesSalesTax,
  quarterStart,
  summarizeSalesTax,
} from './overviewChecks';
import {
  addSeries,
  agingSplit,
  alignPeriods,
  buildMonthWindow,
  cashFlowByMonth,
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
  OpenBill,
  SalesTaxRateNode,
  SalesTaxSummary,
} from './overviewChecks';
import type {
  AgingSplit,
  AgingTotal,
  CashFlowSeries,
  CashLedgerEntry,
  LockingSnapshot,
  MonthLockState,
  MonthlySeries,
  OverviewMonth,
  PeriodTotal,
} from './overviewSeries';
import type {
  GeneralLedgerJsonQuery,
  ProfitLossJsonQuery,
} from '@bigcapital/sdk-ts';
import {
  AbilitySubject,
  BillAction,
  CashflowAction,
  ReportsAction,
  SaleInvoiceAction,
} from '@/constants/abilityOption';
import { useAbilityContext } from '@/hooks';
import {
  useAPAgingSummaryJson,
  useARAgingSummaryJson,
  useBills,
  useInvoices,
  useSalesTaxLiabilitySummaryJson,
  useTaxRates,
  useCashflowAccounts,
  useCurrentOrganization,
  useGeneralLedgerJson,
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
  /** Feed-connected accounts whose books disagree with the bank. */
  differingAccounts: Array<{ id: number; name: string }>;
}

export interface CountAmount {
  count: number;
  amount: number;
}

export type CashFlowData = CashFlowSeries;

export interface SalesTaxData extends SalesTaxSummary {
  fromDate: string;
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
  overdueInvoices: PanelState<number>;
  billsDue: PanelState<CountAmount>;
  /** Hidden when the organization charges no sales tax. */
  salesTax: PanelState<SalesTaxData>;
  /** Loaded only while the cash in and out panel is shown. */
  cashFlow: PanelState<CashFlowData>;
}

export interface OverviewDataOptions {
  /** Fetch the general ledger for cash in and out. */
  cashFlow?: boolean;
}

interface LedgerAccountNode {
  id?: number;
  transactions?: CashLedgerEntry[];
  children?: LedgerAccountNode[];
}

/** Ledger lines of the given accounts, wherever they sit in the tree. */
function ledgerLinesOf(
  nodes: LedgerAccountNode[] | undefined,
  accountIds: ReadonlySet<number>,
): CashLedgerEntry[] {
  return (nodes ?? []).flatMap((node) => [
    ...(node.id !== undefined && accountIds.has(node.id)
      ? (node.transactions ?? [])
      : []),
    ...ledgerLinesOf(node.children, accountIds),
  ]);
}

// open bills are few for a small business; past this the count reads "N+".
const OPEN_BILLS_PAGE_SIZE = 200;

const statusFilter = (status: string) =>
  JSON.stringify([
    { index: 1, fieldKey: 'status', comparator: 'equals', value: status },
  ]);

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
  bankBalance?: number | null;
  plaidAccountId?: string | null;
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
    differingAccounts: accountsDifferingFromBank(all).map(({ id, name }) => ({
      id,
      name,
    })),
  };
}

/**
 * Loads everything the overview shows from existing report endpoints: one
 * monthly P&L with previous-year columns (which also yields year to date),
 * A/R and A/P aging, bank account balances and the transactions lock date.
 */
export function useOverviewData({
  cashFlow: wantsCashFlow = false,
}: OverviewDataOptions = {}): OverviewData {
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
  const canReadLedger = ability.can(
    ReportsAction.READ_GENERAL_LEDGET,
    AbilitySubject.Report,
  );

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

  // the bank and cash accounts in the base currency, as the Cash tile reads.
  const cashAccountIds = React.useMemo(() => {
    const rows = accountsQuery.data as unknown as BankAccountRow[] | undefined;
    return rows ? toCash(rows, currencyCode).accounts.map((a) => a.id) : null;
  }, [accountsQuery.data, currencyCode]);
  // gross money in and out needs the ledger lines: the cash flow statement
  // only reports net change by section, and the trial balance only closing
  // totals. One request covers the whole window. It is not filtered by
  // account on the server, because the report compares the ids it receives
  // as strings against numeric ids and so matches nothing; the bank and cash
  // accounts are picked out here instead.
  const canSeeCashFlow = canViewCash && canReadLedger;
  const ledgerQuery = useGeneralLedgerJson(
    {
      fromDate: months[0].start,
      toDate: today,
      basis: 'accrual',
    } as unknown as GeneralLedgerJsonQuery,
    {
      enabled:
        wantsCashFlow &&
        canSeeCashFlow &&
        cashAccountIds !== null &&
        cashAccountIds.length > 0,
    },
  );

  const canViewInvoices = ability.can(
    SaleInvoiceAction.View,
    AbilitySubject.Invoice,
  );
  const canViewBills = ability.can(BillAction.View, AbilitySubject.Bill);
  const canReadSalesTax = ability.can(
    ReportsAction.READ_SALES_TAX_LIABILITY_SUMMARY,
    AbilitySubject.Report,
  );
  // only the count is needed: one row, and the pagination total.
  const overdueInvoicesQuery = useInvoices(
    { page: 1, pageSize: 1, stringifiedFilterRoles: statusFilter('overdue') },
    { enabled: canViewInvoices } as never,
  );
  const openBillsQuery = useBills(
    {
      page: 1,
      pageSize: OPEN_BILLS_PAGE_SIZE,
      stringifiedFilterRoles: statusFilter('unpaid'),
    },
    { enabled: canViewBills },
  );
  const taxRatesQuery = useTaxRates({ enabled: canReadSalesTax });
  const chargesTax = chargesSalesTax(
    (taxRatesQuery.data as unknown as Array<{ rate?: number }>) ?? [],
  );
  const taxFromDate = quarterStart(today);
  const salesTaxQuery = useSalesTaxLiabilitySummaryJson(
    { fromDate: taxFromDate, toDate: today, basis } as never,
    { enabled: canReadSalesTax && chargesTax && isBasisKnown },
  );

  const overdueInvoices = React.useMemo(() => {
    const response = overdueInvoicesQuery.data as
      | { pagination?: { total?: number } }
      | undefined;
    return response ? (response.pagination?.total ?? 0) : null;
  }, [overdueInvoicesQuery.data]);

  const billsDue = React.useMemo(() => {
    const response = openBillsQuery.data as unknown as
      | { data?: OpenBill[] }
      | undefined;
    return response ? billsDueSoon(response.data ?? [], today) : null;
  }, [openBillsQuery.data, today]);

  const salesTax = React.useMemo(() => {
    const response = salesTaxQuery.data as
      | { data?: { taxRates?: SalesTaxRateNode[] } }
      | undefined;
    return response
      ? { ...summarizeSalesTax(response.data?.taxRates), fromDate: taxFromDate }
      : null;
  }, [salesTaxQuery.data, taxFromDate]);

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

  const cashFlow = React.useMemo((): CashFlowData | null => {
    if (cashAccountIds === null) return null;
    const empty = { in: months.map(() => 0), out: months.map(() => 0) };
    // no bank or cash account yet: nothing moved, and nothing to fetch.
    if (cashAccountIds.length === 0) return empty;
    const response = ledgerQuery.data as
      | { data?: LedgerAccountNode[] }
      | undefined;
    if (!response) return null;
    const entries = ledgerLinesOf(response.data, new Set(cashAccountIds));
    return cashFlowByMonth(entries, months);
  }, [cashAccountIds, ledgerQuery.data, months]);

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
    overdueInvoices: panelState(
      canViewInvoices,
      overdueInvoicesQuery,
      overdueInvoices,
    ),
    billsDue: panelState(canViewBills, openBillsQuery, billsDue),
    salesTax: panelState(
      // hidden until the rates say the organization charges tax at all.
      canReadSalesTax && taxRatesQuery.isSuccess && chargesTax,
      salesTaxQuery,
      salesTax,
    ),
    cashFlow: panelState(
      wantsCashFlow && canSeeCashFlow,
      // the ledger waits on the account list, and never runs without accounts.
      cashAccountIds?.length ? ledgerQuery : accountsQuery,
      cashFlow,
    ),
  };
}
