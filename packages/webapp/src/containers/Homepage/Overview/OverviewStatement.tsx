import { Button, Classes } from '@blueprintjs/core';
import clsx from 'classnames';
import React from 'react';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import styles from './Overview.module.scss';
import { formatDelta, formatMonth, formatNumber } from './overviewFormat';
import { profitLossLink } from './overviewLinks';
import { compareAmounts, magnitude, sumRange } from './overviewSeries';
import type { MonthlySeries } from './overviewSeries';
import type { OverviewData } from './useOverviewData';

// complete months shown before the month in progress.
const COMPLETE_MONTHS = 4;

interface StatementRow {
  key: string;
  label: string;
  series?: MonthlySeries;
  /** Costs print in parentheses, the statement convention for deductions. */
  isCost?: boolean;
  kind: 'group' | 'line' | 'gross' | 'net';
}

const hasActivity = (series: MonthlySeries) =>
  series.current.some((value) => value !== 0) ||
  series.prior.some((value) => value !== 0);

/**
 * A compact profit and loss: the last four complete months, the month in
 * progress to date (shaded), year to date, and the change on the prior year.
 */
export function OverviewStatement({
  data,
  compare,
}: {
  data: OverviewData;
  compare: boolean;
}) {
  const history = useHistory();
  const { months, profitLoss, fiscalStartIndex: start, today, basis } = data;
  if (profitLoss.status === 'hidden') return null;

  const last = months.length - 1;
  const columns = months.slice(last - COMPLETE_MONTHS, last);
  const firstColumn = last - COMPLETE_MONTHS;
  const report = profitLoss.data;
  const reportLink = profitLossLink({
    fromDate: months[0].start,
    toDate: today,
    basis,
    monthly: true,
  });

  const rows: StatementRow[] = report
    ? [
        {
          key: 'income',
          label: intl.get('homepage.overview.income'),
          kind: 'group',
        },
        {
          key: 'revenue',
          label: intl.get('homepage.overview.revenue'),
          series: report.income,
          kind: 'line',
        },
        ...(hasActivity(report.costOfGoods)
          ? [
              {
                key: 'cogs',
                label: intl.get('homepage.overview.cost_of_goods'),
                series: report.costOfGoods,
                isCost: true,
                kind: 'line' as const,
              },
            ]
          : []),
        {
          key: 'gross',
          label: intl.get('homepage.overview.gross_profit'),
          series: report.grossProfit,
          kind: 'gross',
        },
        {
          key: 'expenses',
          label: intl.get('homepage.overview.expenses'),
          kind: 'group',
        },
        {
          key: 'operating',
          label: intl.get('homepage.overview.operating_expenses'),
          series: report.expenses,
          isCost: true,
          kind: 'line',
        },
        ...(hasActivity(report.otherIncome)
          ? [
              {
                key: 'other-income',
                label: intl.get('homepage.overview.other_income'),
                series: report.otherIncome,
                kind: 'line' as const,
              },
            ]
          : []),
        ...(hasActivity(report.otherExpenses)
          ? [
              {
                key: 'other-expenses',
                label: intl.get('homepage.overview.other_expenses'),
                series: report.otherExpenses,
                isCost: true,
                kind: 'line' as const,
              },
            ]
          : []),
        {
          key: 'net',
          label: intl.get('homepage.overview.net_income'),
          series: report.netIncome,
          kind: 'net',
        },
      ]
    : [];

  const cell = (value: number, isCost?: boolean) =>
    formatNumber(isCost ? -value : value);
  const columnCount = columns.length + 3 + (compare ? 1 : 0);

  return (
    <section className={styles.statement} data-testId="overview-statement">
      <div className={styles.statementHead}>
        <span>{intl.get('homepage.overview.statement_title')}</span>
        <Button minimal small onClick={() => history.push(reportLink)}>
          {intl.get('homepage.overview.open_report')}
        </Button>
      </div>
      {profitLoss.status === 'error' ? (
        <div className={styles.tileError} role="alert">
          <span>{intl.get('homepage.overview.panel_error')}</span>
          <div>
            <Button small onClick={profitLoss.retry}>
              {intl.get('homepage.overview.retry')}
            </Button>
          </div>
        </div>
      ) : !report ? (
        <div className={clsx(Classes.SKELETON, styles.skeletonChart)} />
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{data.currencyCode}</th>
              {columns.map((month) => (
                <th key={month.key}>{formatMonth(month.key, 'MMM')}</th>
              ))}
              <th className={styles.colToDate}>
                {intl.get('homepage.overview.month_to_date', {
                  month: formatMonth(months[last].key, 'MMM'),
                })}
              </th>
              <th className={styles.colYear}>
                {intl.get('homepage.overview.year_to_date')}
              </th>
              {compare && (
                <th className={styles.colVs}>
                  {intl.get('homepage.overview.vs_year', {
                    year: data.priorYear,
                  })}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              if (row.kind === 'group' || !row.series) {
                return (
                  <tr key={row.key} className={styles.rowGroup}>
                    <td colSpan={columnCount}>{row.label}</td>
                  </tr>
                );
              }
              const { current, prior } = row.series;
              const ytd = sumRange(current, start, last);
              const comparison = compareAmounts(
                ytd,
                sumRange(prior, start, last),
                magnitude(current.slice(start), prior.slice(start)),
              );
              const delta =
                comparison.kind === 'delta' ? comparison.fraction : null;
              return (
                <tr
                  key={row.key}
                  className={clsx({
                    [styles.rowGross]: row.kind === 'gross',
                    [styles.rowNet]: row.kind === 'net',
                  })}
                >
                  <td>{row.label}</td>
                  {columns.map((month, i) => (
                    <td key={month.key}>
                      {cell(current[firstColumn + i], row.isCost)}
                    </td>
                  ))}
                  <td className={styles.colToDate}>
                    {cell(current[last], row.isCost)}
                  </td>
                  <td className={styles.colYear}>{cell(ytd, row.isCost)}</td>
                  {compare && (
                    <td className={styles.colVs}>
                      {delta === null ? '' : formatDelta(delta)}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
}
