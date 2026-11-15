import { Button, Classes } from '@blueprintjs/core';
import clsx from 'classnames';
import React from 'react';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import styles from './Overview.module.scss';
import { deriveTasks } from './overviewChecks';
import { formatMoney, formatMonth, joinNames } from './overviewFormat';
import {
  BANK_ACCOUNTS_LINK,
  BILLS_LINK,
  RECEIVABLE_AGING_LINK,
  categorizeLink,
} from './overviewLinks';
import { useLockMonth } from './useLockMonth';
import type { Task, TaskId } from './overviewChecks';
import type { OverviewData } from './useOverviewData';

const LABEL_KEYS: Record<Exclude<TaskId, 'lock'>, string> = {
  categorize: 'homepage.overview.task_categorize',
  'overdue-invoices': 'homepage.overview.task_overdue_invoices',
  'bills-due': 'homepage.overview.task_bills_due',
  'bank-differs': 'homepage.overview.task_bank_differs',
};

const ACTION_KEYS: Record<TaskId, string> = {
  categorize: 'homepage.overview.action_review',
  lock: 'homepage.overview.action_lock',
  'overdue-invoices': 'homepage.overview.action_review',
  'bills-due': 'homepage.overview.action_pay',
  'bank-differs': 'homepage.overview.action_reconcile',
};

interface OverviewTasksProps {
  data: OverviewData;
  index: number;
  /** Two columns; narrow is one column listing the first few tasks. */
  wide: boolean;
}

// a narrow tile lists this many tasks, then a count of the rest.
const NARROW_TASK_ROWS = 3;

/**
 * What needs the owner now, each with the action that resolves it. Only
 * tasks with something to do are listed; derived from bank feeds, the lock
 * date and the aging reports.
 */
export function OverviewTasks({ data, index, wide }: OverviewTasksProps) {
  const history = useHistory();
  const lockMonth = useLockMonth(data.lock.data);
  const { lock, cash, receivable, overdueInvoices, billsDue } = data;

  const isLoading = [lock, cash, overdueInvoices, billsDue].some(
    (source) => source.status === 'loading',
  );
  if (isLoading) {
    return (
      <div
        className={clsx(styles.tile, { [styles.tileWide]: wide })}
        aria-busy="true"
      >
        <div className={clsx(Classes.SKELETON, styles.skeletonLine)} />
        <div className={clsx(Classes.SKELETON, styles.skeletonChart)} />
      </div>
    );
  }

  const readyMonth = lock.data?.readyMonth ?? null;
  const differing = cash.data?.differingAccounts ?? [];
  const tasks = deriveTasks({
    uncategorizedCount: cash.data?.uncategorizedCount ?? 0,
    readyToLockMonth: readyMonth?.key ?? null,
    overdueInvoices:
      overdueInvoices.data === null
        ? null
        : {
            count: overdueInvoices.data,
            // the amount comes from the A/R aging report when it is visible.
            amount: receivable.data?.overdue ?? 0,
          },
    billsDue: billsDue.data,
    accountsDifferingFromBank: differing.length,
  });

  const labelOf = (task: Task): string => {
    if (task.id === 'lock') {
      return intl.get('homepage.overview.task_lock', {
        month: formatMonth(readyMonth?.key ?? '', 'MMMM'),
      });
    }
    const label = intl.get(LABEL_KEYS[task.id], {
      count: task.count,
      // the number is formatted here so every locale shows Latin digits.
      countText: String(task.count),
      names: joinNames(differing.map((account) => account.name)),
    });
    return task.amount
      ? intl.get('homepage.overview.task_with_amount', {
          label,
          amount: formatMoney(task.amount, data.currencyCode),
        })
      : label;
  };

  const actionOf = (task: Task) => () => {
    switch (task.id) {
      case 'categorize':
        return history.push(
          cash.data?.uncategorizedAccountId
            ? categorizeLink(cash.data.uncategorizedAccountId)
            : BANK_ACCOUNTS_LINK,
        );
      case 'lock':
        return lockMonth();
      case 'overdue-invoices':
        return history.push(RECEIVABLE_AGING_LINK);
      case 'bills-due':
        return history.push(BILLS_LINK);
      default:
        return history.push(BANK_ACCOUNTS_LINK);
    }
  };

  if (tasks.length === 0) {
    // stays in its place, collapsed to one line rather than a tall empty tile.
    return (
      <section
        className={clsx(styles.tile, {
          [styles.tileWide]: wide,
          [styles.tileCompact]: wide,
        })}
        style={{ '--t': index } as React.CSSProperties}
        data-testId="overview-tile-tasks"
      >
        <span className={styles.tileTitle}>
          {intl.get('homepage.overview.tasks')}
        </span>
        <span className={styles.tasksEmpty}>
          {intl.get('homepage.overview.tasks_empty')}
        </span>
      </section>
    );
  }

  const shown = wide ? tasks : tasks.slice(0, NARROW_TASK_ROWS);
  const more = tasks.length - shown.length;

  return (
    <section
      className={clsx(styles.tile, { [styles.tileWide]: wide })}
      style={{ '--t': index } as React.CSSProperties}
      data-testId="overview-tile-tasks"
    >
      <div className={styles.tileHead}>
        <span className={styles.tileTitle}>
          {intl.get('homepage.overview.tasks')}
        </span>
        <span className={styles.period}>
          {intl.get('homepage.overview.tasks_open', {
            count: String(tasks.length),
          })}
        </span>
      </div>
      <ul className={clsx(styles.tasks, { [styles.tasksNarrow]: !wide })}>
        {shown.map((task) => (
          <li key={task.id} className={styles.task}>
            <span className={styles.taskLabel}>
              <i
                className={clsx(styles.dot, {
                  [styles.dotRisk]: task.severity === 'risk',
                  [styles.dotTask]: task.severity === 'task',
                })}
                aria-hidden="true"
              />
              {labelOf(task)}
            </span>
            <Button small onClick={actionOf(task)}>
              {intl.get(ACTION_KEYS[task.id])}
            </Button>
          </li>
        ))}
      </ul>
      {more > 0 && (
        <span className={styles.tasksMore}>
          {intl.get('homepage.overview.more_count', { count: more })}
        </span>
      )}
      <span className={styles.footnote}>
        {intl.get('homepage.overview.tasks_source')}
      </span>
    </section>
  );
}
