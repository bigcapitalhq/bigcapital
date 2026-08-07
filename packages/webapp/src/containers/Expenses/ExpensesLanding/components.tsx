import {
  Intent,
  Button,
  Classes,
  Popover,
  Tooltip,
  Position,
  Tag,
  MenuItem,
  Menu,
  MenuDivider,
} from '@blueprintjs/core';
import clsx from 'classnames';
import React, { ReactNode } from 'react';
import intl from 'react-intl-universal';
import type { DataTableColumn } from '@/components/Datatable/types';
import type { Expense } from '@bigcapital/sdk-ts';
import { FormattedMessage as T, Icon, If, Can } from '@/components';
import { ExpenseAction, AbilitySubject } from '@/constants/abilityOption';
import { CLASSES } from '@/constants/classes';
import { safeCallback } from '@/utils';

interface ExpenseAccount {
  id: number;
  name: string;
  code?: string;
}

interface PaymentAccount {
  id: number;
  name: string;
  code?: string;
}

export type ExpenseCategoryTableRow = {
  id: number;
  amount: number;
  allocatedCostAmount: number;
  expenseAccountId: number;
  projectId?: number;
  description: string;
  unallocatedCostAmount: number;
  expenseAccount?: ExpenseAccount;
};

export type ExpenseTableRow = Omit<Expense, 'categories'> & {
  categories: ExpenseCategoryTableRow[];
  formattedDate?: string;
  formattedAmount?: string;
  paymentAccount?: PaymentAccount;
};

interface ActionsMenuPayload {
  onPublish: (expense: ExpenseTableRow) => void;
  onEdit: (expense: ExpenseTableRow) => void;
  onDelete: (expense: ExpenseTableRow) => void;
  onViewDetails: (expense: ExpenseTableRow) => void;
}

interface ActionsMenuProps {
  row: { original: ExpenseTableRow };
  payload: ActionsMenuPayload;
}

/**
 * Description accessor.
 */
export function DescriptionAccessor(row: ExpenseTableRow): ReactNode {
  return (
    <If condition={!!row.description}>
      <Tooltip
        className={Classes.TOOLTIP_INDICATOR}
        content={row.description}
        position={Position.TOP}
        hoverOpenDelay={250}
      >
        <Icon icon={'file-alt'} iconSize={16} />
      </Tooltip>
    </If>
  );
}

/**
 * Actions menu.
 */
export function ActionsMenu({
  row: { original },
  payload: { onPublish, onEdit, onDelete, onViewDetails },
}: ActionsMenuProps) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="reader-18" />}
        text={intl.get('view_details')}
        onClick={safeCallback(onViewDetails, original)}
      />
      <Can I={ExpenseAction.Edit} a={AbilitySubject.Expense}>
        <MenuDivider />
        <If condition={!original.isPublished}>
          <MenuItem
            icon={
              // Icon wants `iconSize`, not `size`; preserved from @ts-nocheck.
              // @ts-expect-error see comment above
              <Icon icon={'arrow-to-top'} size={16} />
            }
            text={intl.get('publish_expense')}
            onClick={safeCallback(onPublish, original)}
          />
        </If>
      </Can>
      <Can I={ExpenseAction.Edit} a={AbilitySubject.Expense}>
        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={intl.get('edit_expense')}
          onClick={safeCallback(onEdit, original)}
        />
      </Can>
      <Can I={ExpenseAction.Delete} a={AbilitySubject.Expense}>
        <MenuDivider />
        <MenuItem
          icon={<Icon icon="trash-16" iconSize={16} />}
          text={intl.get('delete_expense')}
          intent={Intent.DANGER}
          onClick={safeCallback(onDelete, original)}
        />
      </Can>
    </Menu>
  );
}

/**
 * Actions cell.
 */
export function ActionsCell(props: ActionsMenuProps) {
  return (
    <Popover
      content={<ActionsMenu {...props} />}
      position={Position.RIGHT_BOTTOM}
    >
      <Button icon={<Icon icon="more-h-16" iconSize={16} />} />
    </Popover>
  );
}

/**
 * Publish accessor.
 */
export function PublishAccessor(row: ExpenseTableRow): ReactNode {
  return row.isPublished ? (
    <Tag intent={Intent.SUCCESS} round minimal>
      <T id={'published'} />
    </Tag>
  ) : (
    <Tag round minimal intent={Intent.WARNING}>
      <T id={'draft'} />
    </Tag>
  );
}

/**
 * Expense account accessor.
 */
export function ExpenseAccountAccessor(expense: ExpenseTableRow): ReactNode {
  if (expense.categories.length === 1) {
    return expense.categories[0].expenseAccount?.name;
  } else if (expense.categories.length > 1) {
    return <T id={'expense.column.multi_categories'} />;
  }
  return null;
}

/**
 * Retrieve the expenses table columns.
 */
export function useExpensesTableColumns(): DataTableColumn<ExpenseTableRow>[] {
  return React.useMemo(
    () =>
      [
        {
          id: 'payment_date',
          Header: intl.get('payment_date'),
          accessor: 'formattedDate',
          width: 140,
          className: 'payment_date',
          clickable: true,
        },
        {
          id: 'amount',
          Header: intl.get('full_amount'),
          accessor: 'formattedAmount',
          align: 'right',
          width: 150,
          clickable: true,
          money: true,
          className: clsx(CLASSES.FONT_BOLD),
        },
        {
          id: 'payment_account',
          Header: intl.get('payment_account'),
          accessor: 'paymentAccount.name',
          width: 150,
          clickable: true,
          className: clsx(CLASSES.TEXT_MUTED),
        },
        {
          id: 'expense_account',
          Header: intl.get('expense_account'),
          accessor: (row: ExpenseTableRow) => ExpenseAccountAccessor(row),
          width: 160,
          disableSortBy: true,
          clickable: true,
        },
        {
          id: 'published',
          Header: intl.get('publish'),
          accessor: (row: ExpenseTableRow) => PublishAccessor(row),
          width: 100,
          className: 'publish',
          clickable: true,
        },
        {
          id: 'description',
          Header: intl.get('description'),
          accessor: (row: ExpenseTableRow) => DescriptionAccessor(row),
          width: 150,
          className: 'description',
          disableSortBy: true,
          clickable: true,
        },
      ] as DataTableColumn<ExpenseTableRow>[],
    [],
  );
}
