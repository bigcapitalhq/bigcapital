import React from 'react';
import intl from 'react-intl-universal';
import { TipBody } from './OverviewCharts';
import { formatDelta, formatMoney, formatMonthYear } from './overviewFormat';
import { compareAmounts } from './overviewSeries';
import type { TipRow } from './OverviewCharts';

interface PeriodTipOptions {
  /** `YYYY-MM` of the period shown. */
  monthKey: string;
  current: number;
  prior: number;
  currencyCode: string;
  /** Show last year's row and the change. */
  compare: boolean;
  /** Year-to-date magnitude, so a change from noise is never printed. */
  scale: number;
  isInProgress?: boolean;
  /** Running totals read "Through Oct 2026". */
  isRunningTotal?: boolean;
  /** An extra muted row, e.g. the month's lock state on the strip. */
  extraRows?: TipRow[];
}

const priorKeyOf = (monthKey: string) =>
  `${Number(monthKey.slice(0, 4)) - 1}${monthKey.slice(4)}`;

/**
 * The one tooltip format for every monthly mark: this period at full
 * contrast, the same period last year muted, and the change only when the
 * delta rules call it material. Money is bidi-isolated by `formatMoney`.
 */
export function periodTip({
  monthKey,
  current,
  prior,
  currencyCode,
  compare,
  scale,
  isInProgress = false,
  isRunningTotal = false,
  extraRows = [],
}: PeriodTipOptions): React.ReactNode {
  const labelOf = (key: string, inProgress: boolean) => {
    const month = formatMonthYear(key);
    if (isRunningTotal)
      return intl.get('homepage.overview.through_month', { month });
    // the joiner (comma, Arabic comma) belongs to the translation.
    return inProgress
      ? intl.get('homepage.overview.month_so_far', { month })
      : month;
  };
  const rows: TipRow[] = [
    {
      label: labelOf(monthKey, isInProgress),
      value: formatMoney(current, currencyCode),
    },
  ];
  let note: string | undefined;
  if (compare) {
    const priorKey = priorKeyOf(monthKey);
    rows.push({
      label: labelOf(priorKey, false),
      value: formatMoney(prior, currencyCode),
      muted: true,
    });
    const comparison = compareAmounts(current, prior, scale);
    if (comparison.kind === 'delta') {
      note = intl.get('homepage.overview.tip_change', {
        delta: formatDelta(comparison.fraction),
        year: priorKey.slice(0, 4),
      });
    }
  }
  return <TipBody rows={[...rows, ...extraRows]} note={note} />;
}
