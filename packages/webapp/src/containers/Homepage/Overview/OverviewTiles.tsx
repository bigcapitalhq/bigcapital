import { Button, Classes } from '@blueprintjs/core';
import clsx from 'classnames';
import React from 'react';
import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import styles from './Overview.module.scss';
import {
  AgeBar,
  BarChart,
  LineChart,
  PairedBarChart,
  RankBars,
  TipBody,
} from './OverviewCharts';
import {
  formatDay,
  formatAmount,
  formatDelta,
  formatMoney,
  formatMonth,
  formatMonthYear,
  formatPercent,
  formatRange,
  moneyParts,
} from './overviewFormat';
import {
  BANK_ACCOUNTS_LINK,
  PAYABLE_AGING_LINK,
  RECEIVABLE_AGING_LINK,
  generalLedgerLink,
  profitLossLink,
  profitLossMonthLink,
  salesTaxLink,
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
import { OverviewTasks } from './OverviewTasks';
import { periodTip } from './overviewTips';
import type { AgeSegment } from './OverviewCharts';
import type { OverviewPanelId, OverviewPanelPref } from './overviewPanels';
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
  /** Muted source line in the tile corner, e.g. which report it reads. */
  footnote?: React.ReactNode;
  /** Replaces the single value and meta line, e.g. two lead numbers. */
  lead?: React.ReactNode;
}

// a wide panel shows the whole window; a narrow one its last six months.
const NARROW_MONTHS = 6;

interface TileContext {
  data: OverviewData;
  compare: boolean;
  /** How many trailing months a sized panel shows. */
  monthCount: number;
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
    monthsText: String(Math.round(months)),
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

function Swatch({ second = false }: { second?: boolean }) {
  return (
    <i
      className={clsx(styles.swatch, { [styles.swatchCompanion]: second })}
      aria-hidden="true"
    />
  );
}

/** Tooltip for one month of a paired chart: both amounts, then the month. */
function pairTip(
  monthKey: string,
  isInProgress: boolean,
  rows: Array<[string, number]>,
  currencyCode: string,
): React.ReactNode {
  const month = formatMonthYear(monthKey);
  return (
    <TipBody
      rows={rows.map(([label, value]) => ({
        label,
        value: formatMoney(value, currencyCode),
      }))}
      note={
        isInProgress
          ? intl.get('homepage.overview.month_so_far', { month })
          : month
      }
    />
  );
}

function revenueSpendTile(context: TileContext): TileContent | null {
  const { data, compare, monthCount } = context;
  const profitLoss = data.profitLoss.data;
  if (!profitLoss) return null;
  const { months, currencyCode } = data;
  const start = months.length - monthCount;
  const latest = months.length - 2;
  const latestMonth = months[latest];
  const monthName = formatMonth(latestMonth.key, 'MMMM');
  const priorYear = latestMonth.year - 1;
  const shown = months.slice(start);
  const revenue = profitLoss.income.current.slice(start);
  const spend = profitLoss.spend.current.slice(start);

  const leadItem = (
    series: MonthlySeries,
    labelKey: string,
    second: boolean,
  ) => {
    const comparison = compareAmounts(
      series.current[latest],
      series.prior[latest],
      magnitude(
        series.current.slice(data.fiscalStartIndex),
        series.prior.slice(data.fiscalStartIndex),
      ),
    );
    return (
      <div className={styles.leadItem}>
        <Money amount={series.current[latest]} currencyCode={currencyCode} />
        <div className={styles.meta}>
          <Swatch second={second} />
          {intl.get(labelKey)}
          {compare && (
            <>
              {' · '}
              <ComparisonLine
                comparison={comparison}
                deltaText={intl.get('homepage.overview.vs_month_short', {
                  month: monthName,
                  year: priorYear,
                })}
                plainText={intl.get('homepage.overview.vs_month_plain', {
                  amount: formatMoney(series.prior[latest], currencyCode),
                  month: monthName,
                  year: priorYear,
                })}
                noActivityText={intl.get('homepage.overview.none_in_month', {
                  month: monthName,
                })}
                noPriorText={intl.get('homepage.overview.no_prior_data', {
                  year: priorYear,
                })}
              />
            </>
          )}
        </div>
      </div>
    );
  };

  return {
    title: intl.get('homepage.overview.revenue_spend_months', {
      count: monthCount,
      countText: String(monthCount),
    }),
    period: monthName,
    value: 0,
    meta: null,
    lead: (
      <div className={styles.lead}>
        {leadItem(profitLoss.income, 'homepage.overview.revenue', false)}
        {leadItem(profitLoss.spend, 'homepage.overview.spend', true)}
      </div>
    ),
    chart: (
      <PairedBarChart
        first={revenue}
        second={spend}
        labels={shown.map((month) => formatMonth(month.key, 'MMM'))}
        targets={shown.map((month) => ({
          to: profitLossMonthLink(month),
          label: intl.get('homepage.overview.open_profit_loss_month', {
            month: formatMonthYear(month.key, 'long'),
          }),
        }))}
        tips={shown.map((month, i) =>
          pairTip(
            month.key,
            i === shown.length - 1,
            [
              [intl.get('homepage.overview.revenue'), revenue[i]],
              [intl.get('homepage.overview.spend'), spend[i]],
            ],
            currencyCode,
          ),
        )}
      />
    ),
    to: profitLossLink({
      fromDate: shown[0].start,
      toDate: data.today,
      basis: data.basis,
      monthly: true,
    }),
  };
}

function cashFlowTile(context: TileContext): TileContent | null {
  const { data, monthCount } = context;
  const flow = data.cashFlow.data;
  if (!flow) return null;
  const { months, currencyCode } = data;
  const start = months.length - monthCount;
  const shown = months.slice(start);
  const moneyIn = flow.in.slice(start);
  const moneyOut = flow.out.slice(start);
  const totalIn = moneyIn.reduce((sum, value) => sum + value, 0);
  const totalOut = moneyOut.reduce((sum, value) => sum + value, 0);
  const money = (amount: number) => formatMoney(amount, currencyCode);

  return {
    title: intl.get('homepage.overview.cash_flow_months', {
      count: monthCount,
      countText: String(monthCount),
    }),
    period: intl.get('homepage.overview.cash_flow_net'),
    value: totalIn - totalOut,
    meta:
      totalIn === 0 && totalOut === 0 ? (
        intl.get('homepage.overview.cash_flow_none')
      ) : (
        <>
          <Swatch />
          {intl.get('homepage.overview.cash_in_amount', {
            amount: money(totalIn),
          })}
          {' · '}
          <Swatch second />
          {intl.get('homepage.overview.cash_out_amount', {
            amount: money(totalOut),
          })}
        </>
      ),
    chart: (
      <PairedBarChart
        first={moneyIn}
        second={moneyOut}
        labels={shown.map((month) => formatMonth(month.key, 'MMM'))}
        tips={shown.map((month, i) =>
          pairTip(
            month.key,
            i === shown.length - 1,
            [
              [intl.get('homepage.overview.cash_in'), moneyIn[i]],
              [intl.get('homepage.overview.cash_out'), moneyOut[i]],
            ],
            currencyCode,
          ),
        )}
      />
    ),
    to: generalLedgerLink(shown[0].start, data.today),
    footnote: intl.get('homepage.overview.cash_flow_source'),
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
    case 'revenue-spend':
      return revenueSpendTile(context);
    case 'cash-flow':
      return cashFlowTile(context);
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
              <>
                <span>
                  {cashRows.more > 0 &&
                    intl.get('homepage.overview.more_count', {
                      count: cashRows.more,
                    })}
                </span>
                {/* the whole tile opens Banking; this names where it goes. */}
                <span className={styles.goTo}>
                  {intl.get('homepage.overview.banking_link')}
                </span>
              </>
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
    case 'sales-tax': {
      const tax = data.salesTax.data;
      if (!tax) return null;
      return {
        title: intl.get('homepage.overview.sales_tax_owed'),
        period: intl.get('homepage.overview.date_range', {
          from: formatDay(tax.fromDate),
          to: formatDay(today),
        }),
        value: tax.owed,
        meta:
          tax.charged === 0 && tax.reduced === 0
            ? intl.get('homepage.overview.sales_tax_none')
            : tax.reduced > 0
              ? intl.get('homepage.overview.sales_tax_charged_reduced', {
                  charged: money(tax.charged),
                  reduced: money(tax.reduced),
                })
              : intl.get('homepage.overview.sales_tax_charged', {
                  charged: money(tax.charged),
                }),
        chart: (
          <RankBars
            rows={tax.rates.map((rate) => ({
              key: rate.id,
              label: rate.name,
              value: rate.owed,
              display: formatAmount(rate.owed),
            }))}
            more={
              tax.moreRates > 0
                ? intl.get('homepage.overview.more_count', {
                    count: tax.moreRates,
                  })
                : null
            }
          />
        ),
        to: salesTaxLink({ fromDate: tax.fromDate, toDate: today, basis }),
        footnote: intl.get('homepage.overview.sales_tax_source'),
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
    case 'sales-tax':
      return data.salesTax;
    case 'cash-flow':
      return data.cashFlow;
    default:
      return data.profitLoss;
  }
}

function TileSkeleton({ wide = false }: { wide?: boolean }) {
  return (
    <div
      className={clsx(styles.tile, { [styles.tileWide]: wide })}
      aria-busy="true"
    >
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
  /** Visible panels, in order, with their sizes. */
  panels: OverviewPanelPref[];
}

export function OverviewTiles({ data, compare, panels }: OverviewTilesProps) {
  const visible = panels.filter(
    ({ id }) => id === 'tasks' || panelSource(id, data).status !== 'hidden',
  );
  if (visible.length === 0) return null;

  return (
    <div className={styles.tiles} data-testId="overview-tiles">
      {visible.map(({ id, size }, index) => {
        const wide = size === 'wide';
        if (id === 'tasks') {
          return (
            <OverviewTasks key={id} data={data} index={index} wide={wide} />
          );
        }
        const source = panelSource(id, data);
        if (source.status === 'error') {
          return <TileError key={id} onRetry={source.retry} />;
        }
        const monthCount = wide ? data.months.length : NARROW_MONTHS;
        const content = tileContent(id, { data, compare, monthCount });
        if (!content) return <TileSkeleton key={id} wide={wide} />;

        return (
          <Link
            key={id}
            to={content.to}
            className={clsx(styles.tile, { [styles.tileWide]: wide })}
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
            {content.lead ?? (
              <>
                <Money
                  amount={content.value}
                  currencyCode={data.currencyCode}
                />
                <div className={styles.meta}>{content.meta}</div>
              </>
            )}
            {content.chart}
            {content.footnote && (
              <span className={styles.footnote}>{content.footnote}</span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
