import { Button, Classes, Intent } from '@blueprintjs/core';
import clsx from 'classnames';
import React from 'react';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import styles from './Overview.module.scss';
import { formatMoney, formatMonth, formatPercent } from './overviewFormat';
import { BANK_ACCOUNTS_LINK, categorizeLink } from './overviewLinks';
import { compareAmounts, magnitude, sumRange } from './overviewSeries';
import { useLockMonth } from './useLockMonth';
import type { OverviewData } from './useOverviewData';

interface OverviewStatusProps {
  data: OverviewData;
  compare: boolean;
}

/**
 * The one-line status generated from the same state as the strip and tiles,
 * with the next action: lock the month that just ended, or review the bank
 * transactions still waiting for a category.
 */
export function OverviewStatus({ data, compare }: OverviewStatusProps) {
  const history = useHistory();
  const handleLock = useLockMonth(data.lock.data);
  const { lock, profitLoss, cash, months, fiscalStartIndex } = data;

  if (lock.status === 'loading') {
    return (
      <div className={styles.hero}>
        <div className={clsx(Classes.SKELETON, styles.heroSkeleton)} />
      </div>
    );
  }
  const readyMonth = lock.data?.readyMonth ?? null;
  const thinMonth = lock.data?.thinMonth ?? null;
  const lastLocked = lock.data?.lastLocked ?? null;

  const neverLocked = !lock.data?.lockedThrough;
  const lockLine = neverLocked
    ? intl.get('homepage.overview.nothing_locked')
    : thinMonth
      ? intl.get('homepage.overview.little_recorded', {
          month: formatMonth(thinMonth.key, 'MMMM'),
        })
      : readyMonth
      ? intl.get('homepage.overview.ready_to_lock', {
          month: formatMonth(readyMonth.key, 'MMMM'),
        })
      : lastLocked
        ? intl.get('homepage.overview.locked_through', {
            month: formatMonth(lastLocked.key, 'MMMM'),
          })
        : '';

  // a partial unlock keeps the lock date but opens months for changes.
  const reopened = lock.data?.reopened ?? [];
  const reopenedLine =
    reopened.length === 0
      ? ''
      : intl.get('homepage.overview.reopened', {
          months:
            reopened.length === 1
              ? formatMonth(reopened[0].key, 'MMMM')
              : `${formatMonth(reopened[0].key, 'MMMM')}–${formatMonth(
                  reopened[reopened.length - 1].key,
                  'MMMM',
                )}`,
        });

  let incomeLine: React.ReactNode = null;
  if (profitLoss.data) {
    const last = months.length - 1;
    const net = profitLoss.data.netIncome;
    const ytd = sumRange(net.current, fiscalStartIndex, last);
    const comparison = compareAmounts(
      ytd,
      sumRange(net.prior, fiscalStartIndex, last),
      magnitude(
        net.current.slice(fiscalStartIndex),
        net.prior.slice(fiscalStartIndex),
      ),
    );
    // the up/down clause only for a material change, never from noise.
    const delta = comparison.kind === 'delta' ? comparison.fraction : null;
    const values = {
      amount: formatMoney(ytd, data.currencyCode),
      percent: delta === null ? '' : formatPercent(delta),
      year: data.priorYear,
    };
    const key =
      !compare || delta === null
        ? 'homepage.overview.net_income_this_year'
        : delta >= 0
          ? 'homepage.overview.net_income_up'
          : 'homepage.overview.net_income_down';
    incomeLine = intl.getHTML(key, values);
  }

  const uncategorized = cash.data?.uncategorizedCount ?? 0;
  const reviewAccountId = cash.data?.uncategorizedAccountId ?? null;
  const handleReview = () => {
    history.push(
      reviewAccountId === null
        ? BANK_ACCOUNTS_LINK
        : categorizeLink(reviewAccountId),
    );
  };

  return (
    <div className={styles.hero}>
      <p className={styles.sentence} data-testId="overview-status">
        <i
          className={clsx(styles.sentenceDot, {
            [styles.isTask]: !!readyMonth,
          })}
          aria-hidden="true"
        />
        <span>
          {lockLine && <b>{lockLine}</b>} {reopenedLine} {incomeLine}
        </span>
      </p>
      <div className={styles.actions}>
        {readyMonth && (
          <Button
            intent={Intent.PRIMARY}
            onClick={handleLock}
            data-testId="overview-lock-month"
          >
            {intl.get('homepage.overview.lock_month', {
              month: formatMonth(readyMonth.key, 'MMM'),
            })}
          </Button>
        )}
        {uncategorized > 0 && (
          <Button
            onClick={handleReview}
            title={intl.get('homepage.overview.review_hint')}
            data-testId="overview-review"
          >
            {intl.get('homepage.overview.review')}
            <span className={styles.badge}>{uncategorized}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
