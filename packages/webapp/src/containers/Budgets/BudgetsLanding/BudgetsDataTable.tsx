import * as FF from 'fp-ts/function';
import React, { useCallback } from 'react';
import { BudgetsEmptyStatus } from './BudgetsEmptyStatus';
import { useBudgetsListContext } from './BudgetsListProvider';
import { BudgetActionsMenu, useBudgetsTableColumns } from './components';
import { withBudgets } from './withBudgets';
import { withBudgetsActions } from './withBudgetsActions';
import type { BudgetTableRow } from './components';
import type { WithBudgetsProps } from './withBudgets';
import type { WithBudgetsActionsProps } from './withBudgetsActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import {
  DashboardContentTable,
  DataTable,
  TableSkeletonRows,
  TableSkeletonHeader,
} from '@/components';
import { TABLES } from '@/constants/tables';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { useMemorizedColumnsWidths } from '@/hooks';

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

  // Local storage memorizing columns widths.
  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.BUDGETS);

  // Handle fetch data of the budgets datatable.
  const handleFetchData = useCallback(
    ({
      pageIndex,
      pageSize,
      sortBy,
    }: {
      pageIndex: number;
      pageSize: number;
      sortBy: Array<{ id: string; desc: boolean }>;
    }) => {
      setBudgetsTableState({
        pageIndex,
        pageSize,
        sortBy,
      });
    },
    [setBudgetsTableState],
  );

  // Handle budget delete action.
  const handleDeleteBudget = (budget: BudgetTableRow) => {
    openAlert('budget-delete', { budgetId: budget.id });
  };

  // Display empty status instead of the table.
  if (isEmptyStatus) {
    return <BudgetsEmptyStatus />;
  }

  return (
    <DashboardContentTable>
      <DataTable
        columns={columns}
        data={budgets || []}
        loading={isBudgetsLoading}
        headerLoading={isBudgetsLoading}
        progressBarLoading={isBudgetsFetching}
        noInitialFetch={true}
        sticky={true}
        rowTestId={'budget-row'}
        onFetchData={handleFetchData}
        pagination={true}
        initialPageIndex={budgetsTableState?.pageIndex ?? 0}
        initialPageSize={budgetsTableState?.pageSize ?? 20}
        manualSortBy={true}
        manualPagination={true}
        rowsCount={pagination?.total ?? 0}
        autoResetSortBy={false}
        autoResetPage={false}
        TableLoadingRenderer={TableSkeletonRows}
        TableHeaderSkeletonRenderer={TableSkeletonHeader}
        ContextMenu={BudgetActionsMenu}
        initialColumnsWidths={initialColumnsWidths}
        onColumnResizing={handleColumnResizing}
        payload={{
          onDelete: handleDeleteBudget,
        }}
      />
    </DashboardContentTable>
  );
}

export const BudgetsDataTable = FF.pipe(
  BudgetsDataTableInner,
  withBudgets(({ budgetsTableState }) => ({ budgetsTableState })),
  withBudgetsActions,
  withAlertActions,
);
