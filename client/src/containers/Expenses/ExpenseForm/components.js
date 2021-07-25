import React from 'react';
import { Button, Tooltip, Intent, Position, Checkbox } from '@blueprintjs/core';
import { FormattedMessage as T } from 'components';
import { Icon, Hint } from 'components';
import intl from 'react-intl-universal';
import {
  InputGroupCell,
  MoneyFieldCell,
  AccountsListFieldCell,
  CheckBoxFieldCell,
} from 'components/DataTableCells';
import { formattedAmount, safeSumBy } from 'utils';

/**
 * Expense category header cell.
 */
const ExpenseCategoryHeaderCell = () => {
  return (
    <>
      <T id={'expense_category'} />
      <Hint />
    </>
  );
};

/**
 * Actions cell renderer.
 */
const ActionsCellRenderer = ({
  row: { index },
  column: { id },
  cell: { value: initialValue },
  data,
  payload,
}) => {
  const onClickRemoveRole = () => {
    payload.removeRow(index);
  };
  return (
    <Tooltip content={<T id={'remove_the_line'} />} position={Position.LEFT}>
      <Button
        icon={<Icon icon="times-circle" iconSize={14} />}
        iconSize={14}
        className="ml2"
        minimal={true}
        intent={Intent.DANGER}
        onClick={onClickRemoveRole}
      />
    </Tooltip>
  );
};

/**
 * Landed cost header cell.
 */
const LandedCostHeaderCell = () => {
  return (
    <>
      <T id={'cost'} />
      <Hint content={''} />
    </>
  );
};

/**
 * Amount footer cell.
 */
function AmountFooterCell({ payload: { currencyCode }, rows }) {
  const total = safeSumBy(rows, 'original.amount');
  return <span>{formattedAmount(total, currencyCode)}</span>;
}

/**
 * Expense amount header cell.
 */
export function ExpenseAmountHeaderCell({ payload: { currencyCode } }) {
  return intl.get('amount_currency', { currency: currencyCode });
}

/**
 * Expense account footer cell.
 */
function ExpenseAccountFooterCell() {
  return <T id={'total'} />;
}

/**
 * Retrieve expense form table entries columns.
 */
export function useExpenseFormTableColumns() {
  return React.useMemo(
    () => [
      {
        Header: '#',
        accessor: 'index',
        Cell: ({ row: { index } }) => <span>{index + 1}</span>,
        className: 'index',
        width: 40,
        disableResizing: true,
        disableSortBy: true,
      },
      {
        Header: ExpenseCategoryHeaderCell,
        id: 'expense_account_id',
        accessor: 'expense_account_id',
        Cell: AccountsListFieldCell,
        Footer: ExpenseAccountFooterCell,
        className: 'expense_account_id',
        disableSortBy: true,
        width: 40,
        filterAccountsByRootTypes: ['expense'],
      },
      {
        Header: ExpenseAmountHeaderCell,
        accessor: 'amount',
        Cell: MoneyFieldCell,
        Footer: AmountFooterCell,
        disableSortBy: true,
        width: 40,
        className: 'amount',
      },
      {
        Header: intl.get('description'),
        accessor: 'description',
        Cell: InputGroupCell,
        disableSortBy: true,
        className: 'description',
        width: 100,
      },
      {
        Header: LandedCostHeaderCell,
        accessor: 'landed_cost',
        Cell: CheckBoxFieldCell,
        disableSortBy: true,
        disableResizing: true,
        width: 70,
        className: 'landed_cost',
      },
      {
        Header: '',
        accessor: 'action',
        Cell: ActionsCellRenderer,
        className: 'actions',
        disableSortBy: true,
        disableResizing: true,
        width: 45,
      },
    ],
    [],
  );
}
