import * as FF from 'fp-ts/function';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { BudgetsEmptyStatus } from './BudgetsEmptyStatus';
import { useBudgetsListContext } from './BudgetsListProvider';
import { BudgetActionsMenu, useBudgetsTableColumns } from './components';
import { withBudgets } from './withBudgets';
import { withBudgetsActions } from './withBudgetsActions';
import type { BudgetTableRow } from './components';
import type { WithBudgetsProps } from './withBudgets';
import type { WithBudgetsActionsProps } from './withBudgetsActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { createDashboardListTable } from '@/components/Datatable/DashboardListTable';
import { AbilitySubject, BudgetAction } from '@/constants/abilityOption';
import { TABLES } from '@/constants/tables';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { useAbilityContext } from '@/hooks';

const Table = createDashboardListTable({
  tableName: TABLES.BUDGETS,
  rowName: 'budget',
  identifierColumn: 'name',
  ActionsMenu: BudgetActionsMenu,
});

interface BudgetsDataTableProps
  extends Pick<WithBudgetsProps, 'budgetsTableState'>,
    Pick<WithBudgetsActionsProps, 'setBudgetsTableState'>,
    Pick<WithAlertActionsProps, 'openAlert'> {}

/**
 * Budgets datatable.
 */
function BudgetsDataTableInner({
  // #withBudgets
  budgetsTableState,

  // #withBudgetsActions
  setBudgetsTableState,

  // #withAlertActions
  openAlert,
}: BudgetsDataTableProps) {
  const history = useHistory();
  const ability = useAbilityContext();

  // Budgets list context.
  const {
    budgets,
    pagination,
    isBudgetsLoading,
    isBudgetsFetching,
    isEmptyStatus,
  } = useBudgetsListContext();

  // Budgets table columns.
  const columns = useBudgetsTableColumns();

  // Handle budget delete action.
  const handleDeleteBudget = (budget: BudgetTableRow) => {
    openAlert('budget-delete', { budgetId: budget.id });
  };

  const handleEditBudget = (budget: BudgetTableRow) => {
    if (ability.can(BudgetAction.Edit, AbilitySubject.Budget)) {
      history.push(`/budgets/${budget.id}/edit`);
    }
  };

  // Display empty status instead of the table.
  if (isEmptyStatus) {
    return <BudgetsEmptyStatus />;
  }

  return (
    <Table
      columns={columns}
      data={budgets}
      total={pagination?.total}
      loading={isBudgetsLoading}
      fetching={isBudgetsFetching}
      compact={false}
      query={budgetsTableState}
      setQuery={setBudgetsTableState}
      actions={{
        onDelete: handleDeleteBudget,
        onViewDetails: handleEditBudget,
      }}
    />
  );
}

export const BudgetsDataTable = FF.pipe(
  BudgetsDataTableInner,
  withBudgets(({ budgetsTableState }) => ({ budgetsTableState })),
  withBudgetsActions,
  withAlertActions,
);
