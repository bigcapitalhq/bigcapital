import * as FF from 'fp-ts/function';
import React from 'react';
import { BudgetsDataTable } from './BudgetsDataTable';
import { BudgetsListProvider } from './BudgetsListProvider';
import { withBudgets } from './withBudgets';
import { withBudgetsActions } from './withBudgetsActions';
import type { WithBudgetsProps } from './withBudgets';
import type { WithBudgetsActionsProps } from './withBudgetsActions';
import { DashboardPageContent } from '@/components';
import { transformTableStateToQuery } from '@/utils';

interface BudgetsListInnerProps
  extends Pick<
      WithBudgetsProps,
      'budgetsTableState' | 'budgetsTableStateChanged'
    >,
    Pick<WithBudgetsActionsProps, 'resetBudgetsTableState'> {}

/**
 * Budgets list page.
 */
function BudgetsListInner({
  // #withBudgets
  budgetsTableState,
  budgetsTableStateChanged,

  // #withBudgetsActions
  resetBudgetsTableState,
}: BudgetsListInnerProps) {
  // Resets the budgets table state once the page unmount.
  React.useEffect(
    () => () => {
      resetBudgetsTableState();
    },
    [resetBudgetsTableState],
  );

  return (
    <BudgetsListProvider
      query={transformTableStateToQuery(budgetsTableState)}
      tableStateChanged={!!budgetsTableStateChanged}
    >
      <DashboardPageContent>
        <BudgetsDataTable />
      </DashboardPageContent>
    </BudgetsListProvider>
  );
}

export const BudgetsList = FF.pipe(
  BudgetsListInner,
  withBudgets(({ budgetsTableState, budgetsTableStateChanged }) => ({
    budgetsTableState,
    budgetsTableStateChanged,
  })),
  withBudgetsActions,
);
