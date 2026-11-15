import { Button } from '@blueprintjs/core';
import clsx from 'classnames';
import React from 'react';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import styles from './CashflowAccounts.module.scss';
import type { CashflowAccountRow } from './components';
import type { SummaryAccount } from '@/containers/Homepage/Overview/overviewChecks';
import {
  feedStatus,
  summarizeBankAccounts,
} from '@/containers/Homepage/Overview/overviewChecks';
import { formatMoney } from '@/containers/Homepage/Overview/overviewFormat';
import { categorizeLink } from '@/containers/Homepage/Overview/overviewLinks';

/** The fields of a bank account row these details read, all already returned. */
export type DetailAccount = CashflowAccountRow &
  SummaryAccount & {
    lastFeedsUpdatedAt?: string | null;
  };

const money = (amount: number, currencyCode: string) =>
  formatMoney(amount, currencyCode, { withMinorUnits: true });

/** "1010 · USD · credit card" under the account name. */
export function accountSubtitle(account: DetailAccount): string {
  return [
    account.code,
    account.currencyCode,
    account.accountType === 'credit-card'
      ? intl.get('banking.accounts.credit_card')
      : null,
  ]
    .filter(Boolean)
    .join(' · ');
}

/** The account balance in its own currency, with its minor units. */
export function accountBalance(account: DetailAccount): string {
  return account.amount == null
    ? '—'
    : money(account.amount, account.currencyCode ?? '');
}

interface AccountStatusProps {
  account: DetailAccount;
  baseCurrency?: string;
  rates: Record<string, number>;
}

/**
 * Whether the books match the bank feed, and the base-currency equivalent of
 * a foreign balance when a rate is available.
 */
export function AccountStatus({
  account,
  baseCurrency,
  rates,
}: AccountStatusProps) {
  const currency = account.currencyCode ?? '';
  const status = feedStatus(account);
  const rate = rates[currency];
  const showEquivalent =
    !!baseCurrency && currency !== baseCurrency && !!rate && account.amount;

  let line: React.ReactNode;
  if (status.kind === 'differs') {
    line = intl.get(
      status.difference > 0
        ? 'banking.accounts.feed_ahead'
        : 'banking.accounts.feed_behind',
      {
        bank: money(status.bankBalance, currency),
        difference: money(Math.abs(status.difference), currency),
      },
    );
  } else if (status.kind === 'matches') {
    // the server computes the relative time, as the page always has.
    line = account.lastFeedsUpdatedFromNow
      ? intl.get('banking.accounts.feed_matches_synced', {
          when: account.lastFeedsUpdatedFromNow,
        })
      : intl.get('banking.accounts.feed_matches');
  } else {
    line = intl.get('banking.accounts.no_feed');
  }

  return (
    <>
      <div
        className={clsx(styles.line, {
          [styles.matches]: status.kind === 'matches',
          [styles.differs]: status.kind === 'differs',
          [styles.noFeed]: status.kind === 'no-feed',
        })}
      >
        <i className={styles.dot} aria-hidden="true" />
        <span>{line}</span>
      </div>
      {showEquivalent && (
        <div className={styles.line}>
          {intl.get('banking.accounts.equivalent', {
            amount: formatMoney(
              (account.amount ?? 0) * rate,
              baseCurrency as string,
            ),
            currency: baseCurrency,
          })}
        </div>
      )}
    </>
  );
}

/** "Categorize N", opening the account's uncategorized transactions. */
export function CategorizeButton({ account }: { account: DetailAccount }) {
  const history = useHistory();
  const count = account.uncategorizedTransactionsCount ?? 0;
  if (count <= 0) return null;

  // the card itself is a link; this button must not also follow it.
  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    history.push(categorizeLink(account.id));
  };
  return (
    <Button small onClick={handleClick}>
      {intl.get('banking.accounts.categorize_count', { count })}
    </Button>
  );
}

interface AccountsSummaryProps {
  accounts: DetailAccount[];
  baseCurrency?: string;
  rates: Record<string, number>;
}

/** Totals above the grid: cash in the base currency and what needs attention. */
export function AccountsSummary({
  accounts,
  baseCurrency,
  rates,
}: AccountsSummaryProps) {
  if (!baseCurrency || accounts.length === 0) return null;
  const summary = summarizeBankAccounts(accounts, baseCurrency, rates);

  return (
    <div className={styles.summary} data-testId="bank-accounts-summary">
      <span>
        <b className={styles.balance}>
          {formatMoney(summary.total, baseCurrency)}
        </b>
        {intl.get(
          summary.isComplete
            ? 'banking.accounts.summary_total'
            : 'banking.accounts.summary_total_partial',
          { currency: baseCurrency },
        )}
      </span>
      <span>
        <b>{summary.toCategorize}</b>
        {intl.get('banking.accounts.summary_to_categorize')}
      </span>
      <span>
        <b>{summary.differFromBank}</b>
        {intl.get('banking.accounts.summary_differ')}
      </span>
      <span>
        <b>{summary.withoutFeed}</b>
        {intl.get('banking.accounts.summary_no_feed')}
      </span>
    </div>
  );
}
