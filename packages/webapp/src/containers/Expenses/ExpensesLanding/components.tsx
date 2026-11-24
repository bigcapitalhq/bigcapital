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
import { createColumnHelper } from '@tanstack/react-table';
import clsx from 'classnames';
import React, { ReactNode } from 'react';
import intl from 'react-intl-universal';
import type { Expense } from '@bigcapital/sdk-ts';
import type { BP_TableFeatures } from '@bigcapitalhq/blueprintjs-react-table';
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
            icon={<Icon icon={'arrow-to-top'} iconSize={16} />}
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
export function ExpenseAccountAccessor(expense: ExpenseTableRow) {
  if (expense.categories.length === 1) {
    return expense.categories[0].expenseAccount?.name;
  } else if (expense.categories.length > 1) {
    return intl.get('expense.column.multi_categories');
  }
  return null;
}

const column = createColumnHelper<BP_TableFeatures, ExpenseTableRow>();

export function useExpensesTableColumns() {
  return React.useMemo(
    () =>
      column.columns([
        column.accessor('formattedDate', {
          id: 'payment_date',
          header: intl.get('payment_date'),
          size: 140,
        }),
        column.accessor('formattedAmount', {
          id: 'amount',
          header: intl.get('full_amount'),
          size: 150,
          meta: {
            textAlign: 'right',
            bodyCellClassName: clsx('numeric-cell', CLASSES.FONT_BOLD),
          },
        }),
        column.accessor((row) => row.paymentAccount?.name, {
          id: 'payment_account',
          header: intl.get('payment_account'),
          size: 150,
          meta: { bodyCellClassName: CLASSES.TEXT_MUTED },
        }),
        column.accessor(ExpenseAccountAccessor, {
          id: 'expense_account',
          header: intl.get('expense_account'),
          size: 160,
          enableSorting: false,
        }),
        column.accessor('isPublished', {
          id: 'published',
          header: intl.get('publish'),
          size: 100,
          cell: ({ row }) => PublishAccessor(row.original),
        }),
        column.accessor('description', {
          id: 'description',
          header: intl.get('description'),
          size: 150,
          cell: ({ row }) => DescriptionAccessor(row.original),
          enableSorting: false,
        }),
      ]),
    [],
  );
}
