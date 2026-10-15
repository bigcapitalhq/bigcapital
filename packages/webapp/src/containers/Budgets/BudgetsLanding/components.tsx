import { Intent, Menu, MenuItem } from '@blueprintjs/core';
import React, { ReactNode } from 'react';
import intl from 'react-intl-universal';
import type { DataTableColumn } from '@/components/Datatable/types';
import type { Budget } from '@bigcapital/sdk-ts';
import { Can, Icon } from '@/components';
import { AbilitySubject, BudgetAction } from '@/constants/abilityOption';
import { safeCallback } from '@/utils';

/**
 * Runtime-only fields injected by the server-side budget transformer
 * (not part of the generated SDK schema).
 */
export type BudgetTableRow = Budget & {
  totalBudgetAmount: number;
  formattedTotalBudgetAmount: string;
};

interface BudgetActionsMenuPayload {
  onDelete: (budget: BudgetTableRow) => void;
}

interface BudgetActionsMenuProps {
  row: { original: BudgetTableRow };
  payload: BudgetActionsMenuPayload;
}

/**
 * Budget row actions menu.
 */
export function BudgetActionsMenu({
  row: { original },
  payload: { onDelete },
}: BudgetActionsMenuProps) {
  return (
    <Menu>
      <Can I={BudgetAction.Delete} a={AbilitySubject.Budget}>
        <MenuItem
          icon={<Icon icon="trash-16" iconSize={16} />}
          text={intl.get('budget.delete')}
          intent={Intent.DANGER}
          onClick={safeCallback(onDelete, original)}
        />
      </Can>
    </Menu>
  );
}

/**
 * Budget period accessor.
 */
function PeriodAccessor(budget: BudgetTableRow): ReactNode {
  return `${budget.formattedFromDate} – ${budget.formattedToDate}`;
}

/**
 * Budget entries count accessor.
 */
function EntriesAccessor(budget: BudgetTableRow): ReactNode {
  return budget.entries?.length ?? 0;
}

/**
 * Retrieves the budgets table columns.
 */
export function useBudgetsTableColumns(): DataTableColumn<BudgetTableRow>[] {
  return React.useMemo(
    () =>
      [
        {
          id: 'name',
          Header: intl.get('budget.col_name'),
          accessor: 'name',
          width: 220,
          clickable: true,
        },
        {
          id: 'from_date',
          Header: intl.get('budget.col_period'),
          accessor: (row: BudgetTableRow) => PeriodAccessor(row),
          width: 200,
          disableSortBy: true,
          clickable: true,
        },
        {
          id: 'description',
          Header: intl.get('budget.col_description'),
          accessor: 'description',
          width: 240,
          disableSortBy: true,
          clickable: true,
          textOverview: true,
        },
        {
          id: 'entries',
          Header: intl.get('budget.col_entries'),
          accessor: (row: BudgetTableRow) => EntriesAccessor(row),
          width: 90,
          align: 'right',
          disableSortBy: true,
          clickable: true,
        },
        {
          id: 'total_budget',
          Header: intl.get('budget.col_total'),
          accessor: 'formattedTotalBudgetAmount',
          width: 150,
          align: 'right',
          money: true,
          disableSortBy: true,
          clickable: true,
        },
        {
          id: 'created_at',
          Header: intl.get('budget.col_created_at'),
          accessor: 'formattedCreatedAt',
          width: 150,
          clickable: true,
        },
      ] as DataTableColumn<BudgetTableRow>[],
    [],
  );
}
