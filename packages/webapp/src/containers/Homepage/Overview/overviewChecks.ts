/**
 * Pure derivations for the Tasks and Sales tax panels and the bank accounts
 * page. Everything comes from data Bigcapital already returns: bank account
 * rows, the lock date, aging reports, open bills and the sales tax report.
 */

// below half a cent two balances are the same number.
const BALANCE_TOLERANCE = 0.005;

export interface FeedAccount {
  id: number;
  name: string;
  /** Balance in the books, in the account currency. */
  amount?: number | null;
  /** Balance reported by the bank feed (Plaid), when connected. */
  bankBalance?: number | null;
  plaidAccountId?: string | null;
}

export type FeedStatus =
  | { kind: 'no-feed' }
  | { kind: 'matches' }
  /** `difference` is books minus bank: positive means ahead of the bank. */
  | { kind: 'differs'; bankBalance: number; difference: number };

/** Compares the balance in the books with the balance the bank reports. */
export function feedStatus(account: FeedAccount): FeedStatus {
  const hasFeed =
    !!account.plaidAccountId &&
    typeof account.bankBalance === 'number' &&
    Number.isFinite(account.bankBalance);
  if (!hasFeed) return { kind: 'no-feed' };

  const bankBalance = account.bankBalance as number;
  const difference = (account.amount ?? 0) - bankBalance;
  return Math.abs(difference) < BALANCE_TOLERANCE
    ? { kind: 'matches' }
    : { kind: 'differs', bankBalance, difference };
}

/** Accounts whose books disagree with their bank feed. */
export function accountsDifferingFromBank<T extends FeedAccount>(
  accounts: T[],
): T[] {
  return accounts.filter((account) => feedStatus(account).kind === 'differs');
}

export interface OpenBill {
  dueDate?: string | null;
  dueAmount?: number | null;
}

/**
 * Open bills that are overdue or fall due within `days` of `today`, with the
 * amount still owed on them.
 */
export function billsDueSoon(
  bills: OpenBill[],
  today: string,
  days = 7,
): { count: number; amount: number } {
  const horizon = addDays(today, days);
  let count = 0;
  let amount = 0;
  for (const bill of bills) {
    const due = bill.dueDate?.slice(0, 10);
    const owed = bill.dueAmount ?? 0;
    if (!due || owed <= 0 || due > horizon) continue;
    count += 1;
    amount += owed;
  }
  return { count, amount };
}

function addDays(day: string, days: number): string {
  const date = new Date(`${day.slice(0, 10)}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** The first day of the calendar quarter that contains `today`. */
export function quarterStart(today: string): string {
  const year = Number(today.slice(0, 4));
  const month = Number(today.slice(5, 7));
  const first = Math.floor((month - 1) / 3) * 3 + 1;
  return `${year}-${String(first).padStart(2, '0')}-01`;
}

export type TaskId =
  | 'categorize'
  | 'lock'
  | 'overdue-invoices'
  | 'bills-due'
  | 'bank-differs';

export interface Task {
  id: TaskId;
  /** `risk` is money at stake and time-bound; `task` is an action to take. */
  severity: 'task' | 'risk';
  count: number;
  amount?: number;
}

export interface TaskInput {
  uncategorizedCount: number;
  /** Month key of the most recent ended month that is not locked. */
  readyToLockMonth: string | null;
  overdueInvoices: { count: number; amount: number } | null;
  billsDue: { count: number; amount: number } | null;
  accountsDifferingFromBank: number;
}

/** The open tasks, in a fixed order; a task with nothing to do is omitted. */
export function deriveTasks(input: TaskInput): Task[] {
  const tasks: Task[] = [];
  if (input.uncategorizedCount > 0) {
    tasks.push({
      id: 'categorize',
      severity: 'task',
      count: input.uncategorizedCount,
    });
  }
  if (input.readyToLockMonth) {
    tasks.push({ id: 'lock', severity: 'task', count: 1 });
  }
  if (input.overdueInvoices && input.overdueInvoices.count > 0) {
    tasks.push({
      id: 'overdue-invoices',
      severity: 'risk',
      ...input.overdueInvoices,
    });
  }
  if (input.billsDue && input.billsDue.count > 0) {
    tasks.push({ id: 'bills-due', severity: 'task', ...input.billsDue });
  }
  if (input.accountsDifferingFromBank > 0) {
    tasks.push({
      id: 'bank-differs',
      severity: 'risk',
      count: input.accountsDifferingFromBank,
    });
  }
  return tasks;
}

interface ReportAmount {
  amount?: number | null;
}

export interface SalesTaxRateNode {
  id?: number;
  taxName?: string;
  taxableAmount?: ReportAmount | null;
  /** Net tax payable on the rate: credits less debits on the tax account. */
  taxAmount?: ReportAmount | null;
  /** Debits on the tax account (the report labels these "collected"). */
  collectedTaxAmount?: ReportAmount | null;
}

export interface SalesTaxSummary {
  /** Net tax owed for the period. */
  owed: number;
  /** Tax charged on sales: what was credited to the tax account. */
  charged: number;
  /** Tax that reduced the liability: purchases tax reclaimed or paid. */
  reduced: number;
  taxable: number;
  rates: Array<{ id: string; name: string; owed: number }>;
  moreRates: number;
}

const amountOf = (value: ReportAmount | null | undefined): number =>
  typeof value?.amount === 'number' && Number.isFinite(value.amount)
    ? value.amount
    : 0;

/**
 * Totals the Sales Tax Liability Summary rows. The report gives the net
 * payable and the debits per rate, so the tax charged is their sum.
 */
export function summarizeSalesTax(
  rates: SalesTaxRateNode[] | null | undefined,
  limit = 3,
): SalesTaxSummary {
  const rows = (rates ?? []).map((rate, index) => ({
    id: String(rate.id ?? index),
    name: rate.taxName ?? '',
    owed: amountOf(rate.taxAmount),
    reduced: amountOf(rate.collectedTaxAmount),
    taxable: amountOf(rate.taxableAmount),
  }));
  const ranked = rows
    .filter((row) => Math.round(row.owed * 100) !== 0)
    .sort((a, b) => Math.abs(b.owed) - Math.abs(a.owed));
  const sum = (key: 'owed' | 'reduced' | 'taxable') =>
    rows.reduce((total, row) => total + row[key], 0);
  const owed = sum('owed');
  const reduced = sum('reduced');

  return {
    owed,
    charged: owed + reduced,
    reduced,
    taxable: sum('taxable'),
    rates: ranked
      .slice(0, limit)
      .map(({ id, name, owed: rateOwed }) => ({ id, name, owed: rateOwed })),
    moreRates: Math.max(0, ranked.length - limit),
  };
}

/**
 * Whether the organization charges sales tax at all. Every new organization
 * is seeded with 0% rates, which alone do not make a sales tax panel useful.
 * A rate's `active` flag is not consulted: rates created through the API can
 * be inactive yet still on invoices, and the report includes them.
 */
export function chargesSalesTax(
  rates: Array<{ rate?: number | null }>,
): boolean {
  return rates.some((rate) => (rate.rate ?? 0) > 0);
}

export interface SummaryAccount extends FeedAccount {
  accountType?: string | null;
  currencyCode?: string | null;
  uncategorizedTransactionsCount?: number | null;
}

export interface BankAccountsSummary {
  /** Cash and bank balances in the base currency (cards excluded). */
  total: number;
  /** False when a foreign balance had no rate, so `total` covers only base-currency accounts. */
  isComplete: boolean;
  toCategorize: number;
  differFromBank: number;
  withoutFeed: number;
}

/**
 * The summary row above the bank accounts grid. Foreign balances convert with
 * `rates` (foreign to base); credit cards are owed, not cash, so stay out of
 * the total.
 */
export function summarizeBankAccounts(
  accounts: SummaryAccount[],
  baseCurrency: string,
  rates: Record<string, number>,
): BankAccountsSummary {
  let baseTotal = 0;
  let convertedTotal = 0;
  let isComplete = true;
  let toCategorize = 0;
  let differFromBank = 0;
  let withoutFeed = 0;

  for (const account of accounts) {
    toCategorize += account.uncategorizedTransactionsCount ?? 0;
    const status = feedStatus(account).kind;
    if (status === 'differs') differFromBank += 1;
    if (status === 'no-feed') withoutFeed += 1;

    if (account.accountType === 'credit-card') continue;
    const amount = account.amount ?? 0;
    const currency = account.currencyCode || baseCurrency;
    if (currency === baseCurrency) {
      baseTotal += amount;
    } else if (rates[currency]) {
      convertedTotal += amount * rates[currency];
    } else if (amount !== 0) {
      isComplete = false;
    }
  }
  return {
    total: isComplete ? baseTotal + convertedTotal : baseTotal,
    isComplete,
    toCategorize,
    differFromBank,
    withoutFeed,
  };
}
