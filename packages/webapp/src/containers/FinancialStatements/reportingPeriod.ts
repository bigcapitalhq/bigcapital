/**
 * The last date range a user picked on a financial report, remembered so that
 * moving between reports keeps the same period instead of snapping back to each
 * report's own default.
 *
 * Scope for now is a single localStorage key; a per-user server setting can back
 * this later without changing callers.
 */
const STORAGE_KEY = 'bigcapital:financial-reports:period';

export interface ReportingPeriod {
  fromDate: string;
  toDate: string;
}

const isValid = (value: unknown): value is ReportingPeriod =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as ReportingPeriod).fromDate === 'string' &&
  typeof (value as ReportingPeriod).toDate === 'string';

/**
 * Reads the remembered reporting period, or `null` when nothing is stored or the
 * value is unusable (private window, cleared storage, older shape).
 */
export const readReportingPeriod = (): ReportingPeriod | null => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    return isValid(parsed)
      ? { fromDate: parsed.fromDate, toDate: parsed.toDate }
      : null;
  } catch {
    return null;
  }
};

/**
 * Persists the reporting period. A partial update is merged over what's already
 * stored, so a point-in-time report (aging, balance summary) can move just the
 * `toDate` while keeping the range's start. Nothing is written until both ends
 * are known. Failures (storage disabled/full) are ignored - remembering the
 * range is a convenience, not correctness.
 */
export const writeReportingPeriod = (
  period: Partial<ReportingPeriod>,
): void => {
  const current = readReportingPeriod();
  const fromDate = period.fromDate ?? current?.fromDate;
  const toDate = period.toDate ?? current?.toDate;

  if (!fromDate || !toDate) return;

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ fromDate, toDate }),
    );
  } catch {
    /* no-op */
  }
};

/**
 * Overlays the remembered period onto a report's default query, when one is
 * stored. Only keys the report already declares are touched: a range report
 * gets `fromDate`/`toDate`, a point-in-time report gets its `asDate` set to the
 * range's end. A report opened via a URL that already carries these still wins,
 * because the location query is merged over the defaults downstream.
 */
export const withRememberedPeriod = <T extends object>(defaults: T): T => {
  const remembered = readReportingPeriod();

  if (!remembered) return defaults;

  const overlay: Record<string, string> = {};

  if ('fromDate' in defaults) overlay.fromDate = remembered.fromDate;
  if ('toDate' in defaults) overlay.toDate = remembered.toDate;
  if ('asDate' in defaults) overlay.asDate = remembered.toDate;

  return { ...defaults, ...overlay };
};
