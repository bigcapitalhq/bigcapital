import clsx from 'classnames';
import React from 'react';
import intl from 'react-intl-universal';
import styles from './Overview.module.scss';
import { formatMoney, formatMonth } from './overviewFormat';
import { magnitude } from './overviewSeries';
import { periodTip } from './overviewTips';
import type { MonthLockState } from './overviewSeries';
import type { OverviewData } from './useOverviewData';

const STATE_CLASS: Record<MonthLockState, string | undefined> = {
  locked: undefined,
  reopened: undefined,
  ended: undefined,
  'in-progress': styles.isInProgress,
};

const TIP_KEY: Record<MonthLockState, string> = {
  locked: 'homepage.overview.strip_tip_locked',
  reopened: 'homepage.overview.strip_tip_reopened',
  ended: 'homepage.overview.strip_tip_ended',
  'in-progress': 'homepage.overview.strip_tip_in_progress',
};

// month and state only, when net income is not available to this user.
const STATE_KEY: Record<MonthLockState, string> = {
  locked: 'homepage.overview.strip_month_locked',
  reopened: 'homepage.overview.strip_month_reopened',
  ended: 'homepage.overview.strip_month_ended',
  'in-progress': 'homepage.overview.strip_month_in_progress',
};

const STATE_LABEL_KEY: Record<MonthLockState, string> = {
  locked: 'homepage.overview.state_locked',
  reopened: 'homepage.overview.state_reopened',
  ended: 'homepage.overview.state_ended',
  'in-progress': 'homepage.overview.state_in_progress',
};

function Glyph({ state }: { state: MonthLockState }) {
  if (state === 'locked') {
    return (
      <i className={clsx(styles.glyph, styles.glyphLocked)} aria-hidden="true">
        ✓
      </i>
    );
  }
  return (
    <i
      className={clsx(
        styles.glyph,
        // a reopened month can be edited again, so it reads as not locked.
        state === 'in-progress' ? styles.glyphInProgress : styles.glyphEnded,
      )}
      aria-hidden="true"
    />
  );
}

/**
 * Twelve months of books: whether each is locked (from the transactions lock
 * date), ended but not locked, or still in progress, with a hairline bar of
 * that month's net income.
 */
export function OverviewStrip({
  data,
  compare,
}: {
  data: OverviewData;
  compare: boolean;
}) {
  const [hovered, setHovered] = React.useState<number | null>(null);
  const { months, lock, profitLoss, currencyCode } = data;
  const states = lock.data?.states;
  const readyKey = lock.data?.readyMonth?.key ?? null;
  if (!states) return null;

  const net = profitLoss.data?.netIncome.current ?? null;
  const netPrior = profitLoss.data?.netIncome.prior ?? [];
  const scale = magnitude(
    (net ?? []).slice(data.fiscalStartIndex),
    netPrior.slice(data.fiscalStartIndex),
  );
  const stateLabel = (state: MonthLockState) =>
    intl.get(STATE_LABEL_KEY[state]);
  const peak = net ? Math.max(1, ...net.map(Math.abs)) : 1;

  return (
    <section aria-label={intl.get('homepage.overview.strip_caption')}>
      <div className={styles.stripHead}>
        <span>{intl.get('homepage.overview.strip_caption')}</span>
        <span className={styles.legend}>
          <span>
            <Glyph state="locked" />
            {intl.get('homepage.overview.state_locked')}
          </span>
          <span>
            <Glyph state="ended" />
            {intl.get('homepage.overview.state_ended')}
          </span>
          <span>
            <Glyph state="in-progress" />
            {intl.get('homepage.overview.state_in_progress')}
          </span>
        </span>
      </div>
      <ol className={styles.strip} data-testId="overview-strip">
        {months.map((month, i) => {
          const state = states[i];
          const amount = net?.[i] ?? null;
          const tip =
            amount === null
              ? intl.get(STATE_KEY[state], {
                  month: formatMonth(month.key, 'MMMM'),
                })
              : intl.get(TIP_KEY[state], {
                  month: formatMonth(month.key, 'MMMM'),
                  amount: formatMoney(amount, currencyCode),
                });
          // a sliver stays visible for quiet months so the row reads evenly.
          const width =
            amount === null ? 0 : Math.max(6, (Math.abs(amount) / peak) * 100);
          return (
            <li
              key={month.key}
              className={clsx(styles.month, STATE_CLASS[state], {
                // only the month to lock next is loud; earlier ones stay quiet.
                [styles.isEnded]: month.key === readyKey,
              })}
              tabIndex={0}
              aria-label={tip}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
            >
              <span className={styles.monthRow}>
                <span>
                  {formatMonth(month.key, 'MMM')}
                  {month.year !== months[months.length - 1].year && (
                    // isolated so the apostrophe stays with the year in RTL.
                    <>
                      {' '}
                      <bdi dir="ltr">{`’${String(month.year).slice(2)}`}</bdi>
                    </>
                  )}
                </span>
                <Glyph state={state} />
              </span>
              <span className={styles.netBar}>
                <i
                  className={clsx({ [styles.isLoss]: (amount ?? 0) < 0 })}
                  style={{ width: `${width}%` }}
                />
              </span>
              {hovered === i && (
                <span
                  role="tooltip"
                  className={clsx(styles.tip, styles.monthTip)}
                >
                  {amount === null
                    ? tip
                    : // same format as the chart tooltips, with the lock state.
                      periodTip({
                        monthKey: month.key,
                        current: amount,
                        prior: netPrior[i] ?? 0,
                        currencyCode,
                        compare,
                        scale,
                        isInProgress: month.isInProgress,
                        extraRows: [
                          { label: stateLabel(state), value: '', muted: true },
                        ],
                      })}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
