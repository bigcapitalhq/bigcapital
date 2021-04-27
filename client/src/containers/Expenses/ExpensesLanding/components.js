import React from 'react';
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
import moment from 'moment';
import { FormattedMessage as T } from 'react-intl';
import { Money, Icon, If } from 'components';
import { formatMessage } from 'services/intl';
import { safeCallback } from 'utils';

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
        text={formatMessage({ id: 'view_details' })}
        onClick={safeCallback(onViewDetails, original)}
      />
      <MenuDivider />
      <If condition={!original.is_published}>
        <MenuItem
          icon={<Icon icon={'arrow-to-top'} size={16} />}
          text={formatMessage({ id: 'publish_expense' })}
          onClick={safeCallback(onPublish, original)}
        />
      </If>
      <MenuItem
        icon={<Icon icon="pen-18" />}
        text={formatMessage({ id: 'edit_expense' })}
        onClick={safeCallback(onEdit, original)}
      />
      <MenuItem
        icon={<Icon icon="trash-16" iconSize={16} />}
        text={formatMessage({ id: 'delete_expense' })}
        intent={Intent.DANGER}
        onClick={safeCallback(onDelete, original)}
      />
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
 * Total amount accessor.
 */
export function TotalAmountAccessor(row) {
  return <Money amount={row.total_amount} currency={row.currency_code} />;
}

/**
 * Publish accessor.
 */
export function PublishAccessor(row) {
  return row.is_published ? (
    <Tag minimal={true}>
      <T id={'published'} />
    </Tag>
  ) : (
    <Tag minimal={true} intent={Intent.WARNING}>
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
    const mutliCategories = expense.categories.map((category) => (
      <div>
        - {category.expense_account.name} ${category.amount}
      </div>
    ));
    return (
      <Tooltip content={mutliCategories}>{'- Multi Categories -'}</Tooltip>
    );
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
        Header: formatMessage({ id: 'payment_date' }),
        accessor: (r) => moment(r.payment_date).format('YYYY MMM DD'),
        width: 140,
        className: 'payment_date',
      },
      {
        id: 'amount',
        Header: formatMessage({ id: 'full_amount' }),
        accessor: TotalAmountAccessor,
        className: 'amount',
        width: 150,
      },
      {
        id: 'payment_account',
        Header: formatMessage({ id: 'payment_account' }),
        accessor: 'payment_account.name',
        className: 'payment_account',
        width: 150,
      },
      {
        id: 'expense_account',
        Header: formatMessage({ id: 'expense_account' }),
        accessor: ExpenseAccountAccessor,
        width: 160,
        className: 'expense_account',
        disableSortBy: true,
      },
      {
        id: 'published',
        Header: formatMessage({ id: 'publish' }),
        accessor: PublishAccessor,
        width: 100,
        className: 'publish',
      },
      {
        id: 'description',
        Header: formatMessage({ id: 'description' }),
        accessor: DescriptionAccessor,
        width: 150,
        className: 'description',
        disableSortBy: true,
      },
    ],
    [],
  );
}
