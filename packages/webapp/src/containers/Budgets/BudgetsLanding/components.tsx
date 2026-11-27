import { Intent, Menu, MenuItem } from '@blueprintjs/core';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';
import intl from 'react-intl-universal';
import type { Budget } from '@bigcapital/sdk-ts';
import type { BP_TableFeatures } from '@bigcapitalhq/blueprintjs-react-table';
import { Can, Icon } from '@/components';
import { MoneyDisplay } from '@/components/Money/MoneyDisplay';
import { AbilitySubject, BudgetAction } from '@/constants/abilityOption';
import { safeCallback } from '@/utils';

/**
 * The budget transformer supplies the formatted total outside the SDK schema.
 */
export type BudgetTableRow = Budget & {
  formattedTotalBudgetAmount?: string;
};

interface BudgetActionsMenuPayload {
  onDelete: (budget: BudgetTableRow) => void;
  onViewDetails: (budget: BudgetTableRow) => void;
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
  payload: { onDelete, onViewDetails },
}: BudgetActionsMenuProps) {
  return (
    <Menu>
      <Can I={BudgetAction.Edit} a={AbilitySubject.Budget}>
        <MenuItem
          icon={<Icon icon="edit" iconSize={16} />}
          text={intl.get('budget.edit')}
          onClick={safeCallback(onViewDetails, original)}
        />
      </Can>
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

const column = createColumnHelper<BP_TableFeatures, BudgetTableRow>();

/**
 * Retrieves the budgets table columns.
 */
export function useBudgetsTableColumns() {
  return React.useMemo(
    () =>
      column.columns([
        column.accessor('name', {
          id: 'name',
          header: intl.get('budget.col_name'),
          size: 220,
        }),
        column.accessor(
          (budget) => `${budget.formattedFromDate} – ${budget.formattedToDate}`,
          {
            id: 'from_date',
            header: intl.get('budget.col_period'),
            size: 200,
            enableSorting: false,
          },
        ),
        column.accessor('description', {
          id: 'description',
          header: intl.get('budget.col_description'),
          size: 240,
          enableSorting: false,
        }),
        column.accessor((budget) => budget.entries?.length ?? 0, {
          id: 'entries',
          header: intl.get('budget.col_entries'),
          size: 90,
          meta: { textAlign: 'right' },
          enableSorting: false,
        }),
        column.accessor('formattedTotalBudgetAmount', {
          id: 'total_budget',
          header: intl.get('budget.col_total'),
          size: 150,
          meta: { textAlign: 'right' },
          cell: ({ getValue }) => <MoneyDisplay>{getValue()}</MoneyDisplay>,
          enableSorting: false,
        }),
        column.accessor('formattedCreatedAt', {
          id: 'created_at',
          header: intl.get('budget.col_created_at'),
          size: 150,
        }),
      ]),
    [],
  );
}
