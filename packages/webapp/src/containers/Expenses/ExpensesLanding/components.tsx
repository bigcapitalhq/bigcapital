// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
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

import { CLASSES } from '@/constants/classes';
import { ExpenseAction, AbilitySubject } from '@/constants/abilityOption';
import { FormattedMessage as T, Icon, If, Can } from '@/components';
import { safeCallback } from '@/utils';

/**
 * Description accessor.
 */
export function DescriptionAccessor(row) {
  return (
    <If condition={row.description}>
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
}) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="reader-18" />}
        text={intl.get('view_details')}
        onClick={safeCallback(onViewDetails, original)}
      />
      <Can I={ExpenseAction.Edit} a={AbilitySubject.Expense}>
        <MenuDivider />
        <If condition={!original.is_published}>
          <MenuItem
            icon={<Icon icon={'arrow-to-top'} size={16} />}
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
export function ActionsCell(props) {
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
export function PublishAccessor(row) {
  return row.is_published ? (
    <Tag round={true} minimal={true}>
      <T id={'published'} />
    </Tag>
  ) : (
    <Tag round={true} minimal={true} intent={Intent.WARNING}>
      <T id={'draft'} />
    </Tag>
  );
}

/**
 * Expense account accessor.
 */
export function ExpenseAccountAccessor(expense) {
  if (expense.categories.length === 1) {
    return expense.categories[0].expense_account.name;
  } else if (expense.categories.length > 1) {
    return <T id={'expense.column.multi_categories'} />;
  }
}

/**
 * Retrieve the expenses table columns.
 */
export function useExpensesTableColumns() {
  return React.useMemo(
    () => [
      {
        id: 'payment_date',
        Header: intl.get('payment_date'),
        accessor: 'formatted_date',
        width: 140,
        className: 'payment_date',
        clickable: true,
      },
      {
        id: 'amount',
        Header: intl.get('full_amount'),
        accessor: 'formatted_amount',
        align: 'right',
        width: 150,
        clickable: true,
        money: true,
        className: clsx(CLASSES.FONT_BOLD),
      },
      {
        id: 'payment_account',
        Header: intl.get('payment_account'),
        accessor: 'payment_account.name',
        width: 150,
        clickable: true,
        className: clsx(CLASSES.TEXT_MUTED),
      },
      {
        id: 'expense_account',
        Header: intl.get('expense_account'),
        accessor: ExpenseAccountAccessor,
        width: 160,
        disableSortBy: true,
        clickable: true,
      },
      {
        id: 'published',
        Header: intl.get('publish'),
        accessor: PublishAccessor,
        width: 100,
        className: 'publish',
        clickable: true,
      },
      {
        id: 'description',
        Header: intl.get('description'),
        accessor: DescriptionAccessor,
        width: 150,
        className: 'description',
        disableSortBy: true,
        clickable: true,
      },
    ],
    [],
  );
}
