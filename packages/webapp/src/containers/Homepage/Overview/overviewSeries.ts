/**
 * Pure series math for the homepage overview. No React, no fetching, no
 * dates from the clock: every function takes `today` (or months built from
 * it) so the results are deterministic and unit-testable.
 *
 * Dates are ISO calendar days (`YYYY-MM-DD`) compared as strings, which is
 * exact for that format and avoids time-zone drift from `Date` objects.
 */

export interface OverviewMonth {
  /** `YYYY-MM`. */
  key: string;
  year: number;
  /** Calendar month, 1 to 12. */
  month: number;
  /** First calendar day of the month. */
  start: string;
  /** Last calendar day of the month. */
  end: string;
  /** Last day counted: the month end, or today for the month in progress. */
  toDate: string;
  isInProgress: boolean;
}

/**
 * A month on the lock strip. `ended` means the month is over but the
 * transactions lock date does not cover it yet, so it is ready to lock.
 */
export type MonthLockState = 'locked' | 'reopened' | 'ended' | 'in-progress';

/** Dates temporarily opened for changes inside a lock (partial unlock). */
export interface UnlockWindow {
  from: string;
  to: string;
}

const pad = (value: number): string => String(value).padStart(2, '0');

const isoDay = (year: number, month: number, day: number): string =>
  `${year}-${pad(month)}-${pad(day)}`;

const daysInMonth = (year: number, month: number): number =>
  new Date(Date.UTC(year, month, 0)).getUTCDate();

const parseIsoDay = (value: string) => ({
  year: Number(value.slice(0, 4)),
  month: Number(value.slice(5, 7)),
  day: Number(value.slice(8, 10)),
});

/**
 * Builds `count` consecutive calendar months ending with the month that
 * contains `today`. The last month is in progress and counted to `today`.
 */
export function buildMonthWindow(today: string, count = 12): OverviewMonth[] {
  const { year, month } = parseIsoDay(today);
  const months: OverviewMonth[] = [];

  for (let offset = count - 1; offset >= 0; offset -= 1) {
    // month index from year 0, so subtraction crosses year boundaries.
    const index = year * 12 + (month - 1) - offset;
    const monthYear = Math.floor(index / 12);
    const monthNumber = (index % 12) + 1;
    const end = isoDay(
      monthYear,
      monthNumber,
      daysInMonth(monthYear, monthNumber),
    );
    const isInProgress = offset === 0;

    months.push({
      key: `${monthYear}-${pad(monthNumber)}`,
      year: monthYear,
      month: monthNumber,
      start: isoDay(monthYear, monthNumber, 1),
      end,
      toDate: isInProgress && today < end ? today : end,
      isInProgress,
    });
  }
  return months;
}

/**
 * Derives each month's lock state from the single transactions lock date
 * (a watermark: everything dated on or before it is locked). A month counts
 * as locked only when the watermark reaches its last calendar day. A locked
 * month that a partial unlock window touches is reopened: it can be edited.
 */
export function deriveLockStates(
  months: OverviewMonth[],
  lockedThrough: string | null,
  unlock: UnlockWindow | null = null,
): MonthLockState[] {
  const lockDay = lockedThrough ? lockedThrough.slice(0, 10) : null;

  return months.map((month) => {
    if (lockDay && lockDay >= month.end) {
      const isReopened =
        unlock !== null && unlock.from <= month.end && unlock.to >= month.start;
      return isReopened ? 'reopened' : 'locked';
    }
    return month.isInProgress ? 'in-progress' : 'ended';
  });
}

/**
 * The most recent month that has ended but is not locked. Locking it also
 * locks every earlier month, so it is the one month worth offering.
 */
export function readyToLockMonth(
  months: OverviewMonth[],
  states: MonthLockState[],
): OverviewMonth | null {
  for (let index = months.length - 1; index >= 0; index -= 1) {
    if (states[index] === 'ended') return months[index];
  }
  return null;
}

// a month recording under this share of a typical earlier month looks unfinished.
const THIN_MONTH_SHARE = 0.1;

/**
 * Whether a month records too little to look finished: under a tenth of the
 * median of the earlier months that recorded anything. A month with nothing
 * earlier to compare against is never thin, so a new organization can lock.
 */
export function isThinMonth(activity: number[], index: number): boolean {
  const earlier = activity
    .slice(0, index)
    .filter((amount) => amount > 0)
    .sort((a, b) => a - b);
  if (earlier.length === 0) return false;
  const middle = Math.floor(earlier.length / 2);
  const median =
    earlier.length % 2 === 1
      ? earlier[middle]
      : (earlier[middle - 1] + earlier[middle]) / 2;
  return activity[index] < median * THIN_MONTH_SHARE;
}

/**
 * The most recent month the lock date covers. A reopened month still counts:
 * the lock date has not moved, only a window inside it is open.
 */
export function lastLockedMonth(
  months: OverviewMonth[],
  states: MonthLockState[],
): OverviewMonth | null {
  for (let index = months.length - 1; index >= 0; index -= 1) {
    const state = states[index];
    if (state === 'locked' || state === 'reopened') return months[index];
  }
  return null;
}

interface LockingMeta {
  isEnabled?: boolean;
  lockToDate?: string | null;
  isPartialUnlock?: boolean;
  unlockFromDate?: string | null;
  unlockToDate?: string | null;
}

export interface LockingSnapshot {
  lockingType?: string;
  all?: LockingMeta;
  modules?: LockingMeta[];
}

/**
 * The date the whole ledger is locked through. With per-module (partial)
 * locking the books are only locked through the earliest module lock, and
 * not at all while any module is unlocked.
 */
export function effectiveLockDate(
  locking: LockingSnapshot | undefined,
): string | null {
  if (!locking) return null;

  if (locking.lockingType === 'all') {
    const { all } = locking;
    return all?.isEnabled && all.lockToDate
      ? all.lockToDate.slice(0, 10)
      : null;
  }
  const modules = locking.modules ?? [];
  if (modules.length === 0) return null;

  let earliest: string | null = null;
  for (const module of modules) {
    if (!module.isEnabled || !module.lockToDate) return null;
    const day = module.lockToDate.slice(0, 10);
    if (earliest === null || day < earliest) earliest = day;
  }
  return earliest;
}

/**
 * The dates opened for changes inside the lock, if any. With per-module
 * locking it spans every partially unlocked module, so a month reads as
 * reopened whenever any part of the books can change in it.
 */
export function partialUnlockWindow(
  locking: LockingSnapshot | undefined,
): UnlockWindow | null {
  if (!locking) return null;
  const metas =
    locking.lockingType === 'all'
      ? [locking.all ?? {}]
      : (locking.modules ?? []);

  let window: UnlockWindow | null = null;
  for (const meta of metas) {
    if (!meta.isPartialUnlock || !meta.unlockFromDate || !meta.unlockToDate) {
      continue;
    }
    const from = meta.unlockFromDate.slice(0, 10);
    const to = meta.unlockToDate.slice(0, 10);
    window = window
      ? {
          from: from < window.from ? from : window.from,
          to: to > window.to ? to : window.to,
        }
      : { from, to };
  }
  return window;
}

interface PeriodAmount {
  amount?: number | null;
}

export interface PeriodTotal {
  total?: PeriodAmount | null;
  previousYear?: PeriodAmount | null;
}

export interface MonthlySeries {
  current: number[];
  prior: number[];
}

const amountOf = (value: PeriodAmount | null | undefined): number =>
  typeof value?.amount === 'number' && Number.isFinite(value.amount)
    ? value.amount
    : 0;

/**
 * Aligns a report node's monthly columns to the month window. The report is
 * requested with the window's first day as `fromDate`, so column `i` is month
 * `i`; missing columns (an account with no rows) read as zero.
 */
export function alignPeriods(
  periods: PeriodTotal[] | null | undefined,
  monthCount: number,
): MonthlySeries {
  const current: number[] = [];
  const prior: number[] = [];

  for (let index = 0; index < monthCount; index += 1) {
    const period = periods?.[index];
    current.push(amountOf(period?.total));
    prior.push(amountOf(period?.previousYear));
  }
  return { current, prior };
}

/** Element-wise sum of equal-length series. */
export function addSeries(...series: MonthlySeries[]): MonthlySeries {
  const length = series[0]?.current.length ?? 0;
  const empty = (): number[] => new Array(length).fill(0);
  return series.reduce<MonthlySeries>(
    (sum, item) => ({
      current: sum.current.map((value, i) => value + (item.current[i] ?? 0)),
      prior: sum.prior.map((value, i) => value + (item.prior[i] ?? 0)),
    }),
    { current: empty(), prior: empty() },
  );
}

/** Sum of `values` from index `from` through `to`, both inclusive. */
export function sumRange(values: number[], from: number, to: number): number {
  let total = 0;
  for (let index = Math.max(0, from); index <= to; index += 1) {
    total += values[index] ?? 0;
  }
  return total;
}

/** True when any value is non-zero, i.e. there is something to compare. */
export function hasData(values: number[]): boolean {
  return values.some((value) => value !== 0);
}

/** Running total, so a line chart can show the year building up. */
export function cumulative(values: number[]): number[] {
  let total = 0;
  return values.map((value) => (total += value));
}

/**
 * Relative change from `prior` to `current` as a fraction (0.29 = up 29%).
 * Null when there is nothing meaningful to compare against. The denominator
 * is the prior magnitude so a loss shrinking reads as an improvement.
 */
export function percentChange(current: number, prior: number): number | null {
  if (!Number.isFinite(current) || !Number.isFinite(prior) || prior === 0) {
    return null;
  }
  return (current - prior) / Math.abs(prior);
}

const MONTH_NAMES = [
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

/** Organization fiscal year setting (`january`, ...) to a month number. */
export function fiscalStartMonth(
  fiscalYear: string | null | undefined,
): number {
  const index = MONTH_NAMES.indexOf(String(fiscalYear ?? '').toLowerCase());
  return index === -1 ? 1 : index + 1;
}

/**
 * Index of the month that starts the current fiscal year. A 12-month window
 * always contains it; 0 is the safe fallback for a shorter window.
 */
export function fiscalYearStartIndex(
  months: OverviewMonth[],
  startMonth: number,
): number {
  for (let index = months.length - 1; index >= 0; index -= 1) {
    if (months[index].month === startMonth) return index;
  }
  return 0;
}

// beyond this a runway figure is noise from near-zero spend, not a runway.
const MAX_MEANINGFUL_COVERAGE_MONTHS = 60;

/**
 * How many months the cash would cover at the trailing average spend of the
 * last `sampleSize` complete months. Null unless every one of those months
 * had spend and the result is a plausible runway: a partial import with a
 * $28 month must not claim years of cover.
 */
export function monthsOfSpendCovered(
  cash: number,
  spend: number[],
  sampleSize = 3,
): number | null {
  // the last element is the month in progress; it would understate spend.
  const complete = spend.slice(0, -1).slice(-sampleSize);
  if (complete.length < sampleSize || cash <= 0) return null;
  if (complete.some((value) => value <= 0)) return null;
  const average = complete.reduce((sum, v) => sum + v, 0) / complete.length;
  const months = cash / average;
  return months > MAX_MEANINGFUL_COVERAGE_MONTHS ? null : months;
}

/** Height of a bar in a chart of `maxHeight`; zero or less draws no bar. */
export function barHeight(value: number, peak: number, maxHeight: number) {
  if (!(value > 0) || !(peak > 0)) return 0;
  return (value / peak) * maxHeight;
}

/**
 * Where last year's ghost bar sits: centered on this year's bar and wider by
 * up to a third of the gap on each side, so it stays visible beside a taller
 * current bar without touching its neighbors.
 */
export function priorGhostSpan(x: number, barWidth: number, gap: number) {
  const overhang = Math.max(0, gap / 3);
  return { x: x - overhang, width: barWidth + overhang * 2 };
}

/** Each value's share of the positive total; zero buckets get no width. */
export function positiveShares(values: number[]): number[] {
  const total = values.reduce((sum, v) => sum + Math.max(0, v), 0);
  return values.map((v) => (total > 0 ? Math.max(0, v) / total : 0));
}

/**
 * The non-zero rows with the largest magnitude first, capped at `limit`,
 * plus how many more non-zero rows did not fit.
 */
export function topNonZero<T>(
  rows: T[],
  amountOf: (row: T) => number,
  limit: number,
): { shown: T[]; more: number } {
  const nonZero = rows
    .filter((row) => Math.round(amountOf(row)) !== 0)
    .sort((a, b) => Math.abs(amountOf(b)) - Math.abs(amountOf(a)));
  return {
    shown: nonZero.slice(0, limit),
    more: Math.max(0, nonZero.length - limit),
  };
}

/**
 * How two amounts compare, so the UI never prints a percentage from noise:
 * - `delta`: both sides material, show the % change.
 * - `no-activity`: nothing now while there was activity then.
 * - `plain`: one side is tiny or the sign flipped, so show the prior value.
 * - `no-prior`: nothing to compare against.
 * An amount is tiny below 1% of `scale` (the year-to-date size of the series).
 */
export type Comparison =
  | { kind: 'delta'; fraction: number }
  | { kind: 'no-activity' }
  | { kind: 'plain' }
  | { kind: 'no-prior' };

const MATERIALITY_SHARE = 0.01;

export function compareAmounts(
  current: number,
  prior: number,
  scale: number,
): Comparison {
  const threshold = Math.abs(scale) * MATERIALITY_SHARE;
  const isTiny = (value: number) => Math.abs(value) < threshold;

  if (prior === 0) return { kind: 'no-prior' };
  if (current === 0) {
    return isTiny(prior) ? { kind: 'plain' } : { kind: 'no-activity' };
  }
  if (isTiny(current) || isTiny(prior)) return { kind: 'plain' };
  // a profit turning into a loss is not "down 105%"; show the values.
  if (Math.sign(current) !== Math.sign(prior)) return { kind: 'plain' };
  const fraction = percentChange(current, prior);
  return fraction === null ? { kind: 'no-prior' } : { kind: 'delta', fraction };
}

/** Sum of magnitudes, the scale `compareAmounts` measures materiality by. */
export function magnitude(...series: number[][]): number {
  return Math.max(
    0,
    ...series.map((values) =>
      values.reduce((sum, value) => sum + Math.abs(value), 0),
    ),
  );
}

interface AgingAmount {
  amount?: number | null;
}

export interface AgingTotal {
  current?: AgingAmount | null;
  aging?: Array<{ total?: AgingAmount | null }> | null;
  total?: AgingAmount | null;
}

export interface AgingSplit {
  notDue: number;
  days1to30: number;
  days31plus: number;
  overdue: number;
  total: number;
}

/**
 * Splits an aging summary total requested with 30-day buckets into not due,
 * 1 to 30 days and 31 days or more (every later bucket folded together).
 */
export function agingSplit(total: AgingTotal | null | undefined): AgingSplit {
  const buckets = total?.aging ?? [];
  const notDue = amountOf(total?.current);
  const days1to30 = amountOf(buckets[0]?.total);
  const days31plus = buckets
    .slice(1)
    .reduce((sum, bucket) => sum + amountOf(bucket.total), 0);
  const overdue = days1to30 + days31plus;

  return {
    notDue,
    days1to30,
    days31plus,
    overdue,
    total: notDue + overdue,
  };
}

/** One general ledger line on a bank or cash account. */
export interface CashLedgerEntry {
  date?: string | null;
  debit?: number | null;
  credit?: number | null;
  referenceType?: string | null;
  referenceId?: number | string | null;
}

export interface CashFlowSeries {
  /** Money into bank and cash accounts, per month of the window. */
  in: number[];
  /** Money out of bank and cash accounts, per month of the window. */
  out: number[];
}

/**
 * Gross money in and out of bank and cash accounts per month, from their
 * general ledger lines. Lines are netted per source transaction first, so a
 * transfer between two of the organization's own accounts (a debit on one
 * and a credit on the other) is neither money in nor money out.
 */
export function cashFlowByMonth(
  entries: CashLedgerEntry[],
  months: OverviewMonth[],
): CashFlowSeries {
  const monthIndex = new Map(months.map((month, index) => [month.key, index]));
  const net = new Map<string, { index: number; amount: number }>();

  entries.forEach((entry, position) => {
    const index = monthIndex.get(String(entry.date ?? '').slice(0, 7));
    if (index === undefined) return;
    const key =
      entry.referenceType && entry.referenceId != null
        ? `${entry.referenceType}:${entry.referenceId}:${index}`
        : `line:${position}`;
    const amount = (entry.debit ?? 0) - (entry.credit ?? 0);
    const found = net.get(key);
    if (found) found.amount += amount;
    else net.set(key, { index, amount });
  });

  const series: CashFlowSeries = {
    in: months.map(() => 0),
    out: months.map(() => 0),
  };
  net.forEach(({ index, amount }) => {
    if (amount > 0) series.in[index] += amount;
    else series.out[index] -= amount;
  });
  return series;
}
