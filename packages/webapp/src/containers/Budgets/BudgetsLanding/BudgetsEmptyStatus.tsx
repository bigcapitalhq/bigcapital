import { EmptyStatus, FormattedMessage as T } from '@/components';

/**
 * Budgets list empty status.
 */
export function BudgetsEmptyStatus() {
  return (
    <EmptyStatus
      title={<T id={'budget.empty'} />}
      description={
        <p>
          <T id={'budget.empty_desc'} />
        </p>
      }
    />
  );
}
