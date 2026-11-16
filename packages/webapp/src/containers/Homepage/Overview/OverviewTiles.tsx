import { Button, Classes } from '@blueprintjs/core';
import clsx from 'classnames';
import React from 'react';
import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import styles from './Overview.module.scss';
import { AgeBar, BarChart, LineChart, RankBars } from './OverviewCharts';
import {
  formatDay,
  formatAmount,
  formatDelta,
  formatMoney,
  formatMonth,
  formatPercent,
  formatRange,
  moneyParts,
} from './overviewFormat';
import {
  BANK_ACCOUNTS_LINK,
  PAYABLE_AGING_LINK,
  RECEIVABLE_AGING_LINK,
  profitLossLink,
} from './overviewLinks';
import {
  compareAmounts,
  cumulative,
  magnitude,
  topNonZero,
  monthsOfSpendCovered,
  hasData,
  sumRange,
} from './overviewSeries';
import { periodTip } from './overviewTips';
import type { AgeSegment } from './OverviewCharts';
import type { OverviewPanelId } from './overviewPanels';
import type { AgingSplit, Comparison, MonthlySeries } from './overviewSeries';
import type { OverviewData, PanelState } from './useOverviewData';

const TOP_EXPENSE_ROWS = 4;
const CASH_ACCOUNT_ROWS = 4;

interface TileContent {
  title: React.ReactNode;
  period?: React.ReactNode;
  /** A severity flag replaces the period when money is at risk. */
  riskFlag?: React.ReactNode;
  value: number;
  meta: React.ReactNode;
  chart: React.ReactNode;
  to: string;
}

interface TileContext {
  data: OverviewData;
  compare: boolean;
}

function Money({
  amount,
  currencyCode,
}: {
  amount: number;
  currencyCode: string;
}) {
  const { sign, unit, separator, number, isCode } = moneyParts(
    amount,
    currencyCode,
    { compactLarge: true },
  );
  return (
    <div className={styles.value}>
      {/* the amount keeps its left-to-right order inside RTL tiles. */}
      <span dir="ltr">
        {sign}
        <span className={isCode ? styles.currencyCode : styles.currency}>
          {unit}
        </span>
        {separator}
        {number}
      </span>
    </div>
  );
}

interface ComparisonLineProps {
  comparison: Comparison;
  deltaText: string;
  plainText: string;
  noActivityText: string;
  noPriorText: string;
}

/** The context line under a value: a % change only when both sides matter. */
function ComparisonLine({
  comparison,
  deltaText,
  plainText,
  noActivityText,
  noPriorText,
}: ComparisonLineProps) {
  switch (comparison.kind) {
    case 'delta':
      return (
        <>
          <Delta fraction={comparison.fraction} /> {deltaText}
        </>
      );
    case 'plain':
      return <>{plainText}</>;
    case 'no-activity':
      return <>{noActivityText}</>;
    default:
      return <>{noPriorText}</>;
  }
}

function Delta({ fraction }: { fraction: number | null }) {
  return <b>{fraction === null ? '—' : formatDelta(fraction)}</b>;
}

// beyond two years a month count stops meaning anything to the reader.
const COVERAGE_YEARS_THRESHOLD = 24;

function coverageText(months: number): string {
  if (months > COVERAGE_YEARS_THRESHOLD) {
    return intl.get('homepage.overview.cash_covers_years');
  }
  if (months < 1) return intl.get('homepage.overview.cash_covers_under_month');
  return intl.get('homepage.overview.cash_covers', {
    months: Math.round(months),
  });
}

/** Tooltip text for a monthly mark: month, amount, and the prior year. */
function monthTips(
  { data, compare }: TileContext,
  series: MonthlySeries,
): React.ReactNode[] {
  const last = data.months.length - 1;
  const scale = magnitude(
    series.current.slice(data.fiscalStartIndex),
    series.prior.slice(data.fiscalStartIndex),
  );
  return data.months.map((month, i) =>
    periodTip({
      monthKey: month.key,
      current: series.current[i],
      prior: series.prior[i],
      currencyCode: data.currencyCode,
      compare,
      scale,
      isInProgress: i === last,
    }),
  );
}

function monthlyTile(
  context: TileContext,
  series: MonthlySeries,
  titleKey: string,
  period: React.ReactNode,
  /** Said when the month has ended with nothing in it, e.g. "No revenue in October". */
  emptyMonthKey: string,
): TileContent {
  const { data, compare } = context;
  const latest = data.months.length - 2;
  const latestMonth = data.months[latest];
  const inProgress = data.months[latest + 1];
  const comparison = compareAmounts(
    series.current[latest],
    series.prior[latest],
    magnitude(
      series.current.slice(data.fiscalStartIndex),
      series.prior.slice(data.fiscalStartIndex),
    ),
  );
  const monthName = formatMonth(latestMonth.key, 'MMMM');
  const priorYear = latestMonth.year - 1;
  const showPrior = compare && hasData(series.prior);

  return {
    title: intl.get(titleKey, {
      month: formatMonth(latestMonth.key, 'MMMM'),
    }),
    period,
    value: series.current[latest],
    meta: !compare ? (
      intl.get('homepage.overview.hatched_note', {
        month: formatMonth(inProgress.key, 'MMMM'),
      })
    ) : (
      <ComparisonLine
        comparison={comparison}
        deltaText={intl.get('homepage.overview.vs_month', {
          month: monthName,
          year: priorYear,
        })}
        plainText={intl.get('homepage.overview.vs_month_plain', {
          amount: formatMoney(series.prior[latest], data.currencyCode),
          month: monthName,
          year: priorYear,
        })}
        // the compared month has ended, so this is "no revenue", not "yet".
        noActivityText={intl.get(emptyMonthKey, {
          month: monthName,
        })}
        noPriorText={intl.get('homepage.overview.no_prior_data', {
          year: priorYear,
        })}
      />
    ),
    chart: (
      <BarChart
        values={series.current}
        prior={series.prior}
        showPrior={showPrior}
        tips={monthTips(context, series)}
      />
    ),
    to: profitLossLink({
      fromDate: data.months[0].start,
      toDate: data.today,
      basis: data.basis,
      monthly: true,
    }),
  };
}

function agingTile(
  { data }: TileContext,
  split: AgingSplit,
  titleKey: string,
  to: string,
): TileContent {
  const money = (amount: number) => formatMoney(amount, data.currencyCode);
  const segments: AgeSegment[] = [
    {
      key: 'not-due',
      label: intl.get('homepage.overview.not_due'),
      value: split.notDue,
      display: formatAmount(split.notDue),
      tone: 'history',
    },
    {
      key: '1-30',
      label: intl.get('homepage.overview.days_1_30', {
        range: formatRange(1, 30),
      }),
      value: split.days1to30,
      display: formatAmount(split.days1to30),
      tone: 'risk-hatched',
    },
    {
      key: '31-plus',
      label: intl.get('homepage.overview.days_31_plus', {
        range: formatRange(31),
      }),
      value: split.days31plus,
      display: formatAmount(split.days31plus),
      tone: 'risk',
    },
  ];
  return {
    title: intl.get(titleKey),
    period: intl.get('homepage.overview.as_of_today'),
    riskFlag:
      split.overdue > 0
        ? intl.get('homepage.overview.overdue_flag', {
            amount: money(split.overdue),
          })
        : undefined,
    value: split.total,
    meta:
      split.overdue > 0
        ? intl.get('homepage.overview.not_yet_due', {
            amount: money(split.notDue),
          })
        : intl.get('homepage.overview.nothing_overdue'),
    chart: <AgeBar segments={segments} />,
    to,
  };
}

/** Builds one tile's content, or null while its data is not ready. */
function tileContent(
  id: OverviewPanelId,
  context: TileContext,
): TileContent | null {
  const { data, compare } = context;
  const { months, fiscalStartIndex: start, today, currencyCode, basis } = data;
  const last = months.length - 1;
  const profitLoss = data.profitLoss.data;
  const money = (amount: number) => formatMoney(amount, currencyCode);
  const yearToDateLink = profitLossLink({
    fromDate: months[start].start,
    toDate: today,
    basis,
  });

  switch (id) {
    case 'cash': {
      const cash = data.cash.data;
      if (!cash) return null;
      const covered = profitLoss
        ? monthsOfSpendCovered(cash.total, profitLoss.spend.current)
        : null;
      // zero-balance default accounts say nothing; the count still has them.
      const cashRows = topNonZero(
        cash.accounts,
        (account) => account.amount,
        CASH_ACCOUNT_ROWS,
      );
      return {
        title: intl.get('homepage.overview.cash'),
        period:
          cash.accounts.length === 1
            ? intl.get('homepage.overview.one_account')
            : intl.get('homepage.overview.accounts_count', {
                count: cash.accounts.length,
              }),
        value: cash.total,
        meta:
          covered === null
            ? intl.get('homepage.overview.cash_basis')
            : coverageText(covered),
        chart: (
          <RankBars
            rows={cashRows.shown.map((account) => ({
              key: String(account.id),
              label: account.name,
              value: account.amount,
              display: formatAmount(account.amount),
            }))}
            more={
              cashRows.more > 0
                ? intl.get('homepage.overview.more_count', {
                    count: cashRows.more,
                  })
                : null
            }
          />
        ),
        to: BANK_ACCOUNTS_LINK,
      };
    }
    case 'net-income': {
      if (!profitLoss) return null;
      const net = profitLoss.netIncome;
      const ytd = sumRange(net.current, start, last);
      const ytdPrior = sumRange(net.prior, start, last);
      const running = cumulative(net.current.slice(start));
      const runningPrior = cumulative(net.prior.slice(start));
      const comparison = compareAmounts(
        ytd,
        ytdPrior,
        magnitude(net.current.slice(start), net.prior.slice(start)),
      );
      const showPrior = compare && hasData(net.prior.slice(start));
      return {
        title: intl.get('homepage.overview.net_income_ytd'),
        period: intl.get('homepage.overview.to_date', {
          date: formatDay(today),
        }),
        value: ytd,
        meta: !compare ? (
          intl.get('homepage.overview.date_range', {
            from: formatDay(months[start].start),
            to: formatDay(today),
          })
        ) : (
          <ComparisonLine
            comparison={comparison}
            deltaText={intl.get('homepage.overview.vs_same_date', {
              year: data.priorYear,
              amount: money(ytdPrior),
            })}
            plainText={intl.get('homepage.overview.vs_same_date', {
              year: data.priorYear,
              amount: money(ytdPrior),
            })}
            noActivityText={intl.get('homepage.overview.no_activity_year')}
            noPriorText={intl.get('homepage.overview.no_prior_data', {
              year: data.priorYear,
            })}
          />
        ),
        chart: (
          <LineChart
            values={running}
            prior={runningPrior}
            showPrior={showPrior}
            tips={months.slice(start).map((month, i) =>
              periodTip({
                monthKey: month.key,
                current: running[i],
                prior: runningPrior[i],
                currencyCode,
                compare,
                scale: magnitude(
                  net.current.slice(start),
                  net.prior.slice(start),
                ),
                isRunningTotal: true,
              }),
            )}
          />
        ),
        to: yearToDateLink,
      };
    }
    case 'revenue':
      return profitLoss
        ? monthlyTile(
            context,
            profitLoss.income,
            'homepage.overview.revenue_month',
            null,
            'homepage.overview.no_revenue_month',
          )
        : null;
    case 'spend':
      return profitLoss
        ? monthlyTile(
            context,
            profitLoss.spend,
            'homepage.overview.spend_month',
            intl.get('homepage.overview.spend_basis'),
            'homepage.overview.no_spend_month',
          )
        : null;
    case 'owed':
      return data.receivable.data
        ? agingTile(
            context,
            data.receivable.data,
            'homepage.overview.owed_to_you',
            RECEIVABLE_AGING_LINK,
          )
        : null;
    case 'bills':
      return data.payable.data
        ? agingTile(
            context,
            data.payable.data,
            'homepage.overview.bills_to_pay',
            PAYABLE_AGING_LINK,
          )
        : null;
    case 'top-expenses': {
      if (!profitLoss) return null;
      const total = sumRange(profitLoss.expenses.current, start, last);
      const ranked = profitLoss.expenseAccounts
        .map((account) => ({
          key: account.id,
          label: account.name,
          value: sumRange(account.series.current, start, last),
        }))
        .filter((row) => row.value > 0)
        .sort((a, b) => b.value - a.value);
      const top = ranked[0];
      return {
        title: intl.get('homepage.overview.top_expenses_ytd'),
        period: intl.get('homepage.overview.to_date', {
          date: formatDay(today),
        }),
        value: total,
        meta:
          top && total > 0
            ? intl.get('homepage.overview.top_expense_share', {
                name: top.label,
                percent: formatPercent(top.value / total),
              })
            : intl.get('homepage.overview.no_expenses'),
        chart: (
          <RankBars
            rows={ranked
              .slice(0, TOP_EXPENSE_ROWS)
              .map((row) => ({ ...row, display: formatAmount(row.value) }))}
          />
        ),
        to: yearToDateLink,
      };
    }
    default:
      return null;
  }
}

/** Which query a panel depends on, for its loading and error state. */
function panelSource(
  id: OverviewPanelId,
  data: OverviewData,
): PanelState<unknown> {
  switch (id) {
    case 'cash':
      return data.cash;
    case 'owed':
      return data.receivable;
    case 'bills':
      return data.payable;
    default:
      return data.profitLoss;
  }
}

function TileSkeleton() {
  return (
    <div className={styles.tile} aria-busy="true">
      <div className={clsx(Classes.SKELETON, styles.skeletonLine)} />
      <div className={clsx(Classes.SKELETON, styles.skeletonValue)} />
      <div className={clsx(Classes.SKELETON, styles.skeletonChart)} />
    </div>
  );
}

function TileError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className={styles.tileError} role="alert">
      <span>{intl.get('homepage.overview.panel_error')}</span>
      <div>
        <Button small onClick={onRetry}>
          {intl.get('homepage.overview.retry')}
        </Button>
      </div>
    </div>
  );
}

interface OverviewTilesProps {
  data: OverviewData;
  compare: boolean;
  panelIds: OverviewPanelId[];
}

export function OverviewTiles({ data, compare, panelIds }: OverviewTilesProps) {
  const visible = panelIds.filter(
    (id) => panelSource(id, data).status !== 'hidden',
  );
  if (visible.length === 0) return null;

  return (
    <div className={styles.tiles} data-testId="overview-tiles">
      {visible.map((id, index) => {
        const source = panelSource(id, data);
        if (source.status === 'error') {
          return <TileError key={id} onRetry={source.retry} />;
        }
        const content = tileContent(id, { data, compare });
        if (!content) return <TileSkeleton key={id} />;

        return (
          <Link
            key={id}
            to={content.to}
            className={styles.tile}
            style={{ '--t': index } as React.CSSProperties}
            data-testId={`overview-tile-${id}`}
          >
            <div className={styles.tileHead}>
              <span
                className={styles.tileTitle}
                title={typeof content.title === 'string' ? content.title : ''}
              >
                {content.title}
              </span>
              {content.riskFlag ? (
                <span className={clsx(styles.flag, styles.flagRisk)}>
                  <i className={styles.dot} aria-hidden="true" />
                  {content.riskFlag}
                </span>
              ) : (
                <span className={styles.period}>{content.period}</span>
              )}
            </div>
            <Money amount={content.value} currencyCode={data.currencyCode} />
            <div className={styles.meta}>{content.meta}</div>
            {content.chart}
          </Link>
        );
      })}
    </div>
  );
}
