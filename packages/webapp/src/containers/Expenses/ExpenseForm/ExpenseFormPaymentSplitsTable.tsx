// @ts-nocheck
import React, { useCallback, useMemo } from 'react';
import intl from 'react-intl-universal';
import { Button, Intent, Menu, MenuItem } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';

import { DataTableEditable, Icon } from '@/components';
import {
  AccountsListFieldCell,
  MoneyFieldCell,
} from '@/components/DataTableCells';
import { Align, CellType } from '@/constants';
import {
  saveInvoke,
  compose,
  updateTableCell,
  updateMinEntriesLines,
  updateAutoAddNewLine,
  updateRemoveLineByIndex,
} from '@/utils';
import { useExpenseFormContext } from './ExpenseFormPageProvider';
import {
  defaultPaymentSplit,
  MIN_PAYMENT_SPLIT_LINES,
} from './utils';
import { SUPPORTED_EXPENSE_PAYMENT_ACCOUNT_TYPES } from './constants';

const PaymentAccountHeaderCell = () => intl.get('payment_account');

const PaymentAmountHeaderCell = ({ payload: { currencyCode } }) =>
  intl.get('amount_currency', { currency: currencyCode });

const PaymentActionsCell = ({ row: { index }, payload }) => {
  const menu = (
    <Menu>
      <MenuItem
        intent={Intent.DANGER}
        onClick={() => payload.removeRow(index)}
        text={intl.get('expense.entries.remove_row')}
      />
    </Menu>
  );
  return (
    <Popover2 content={menu} placement="left-start">
      <Button
        icon={<Icon icon={'more-13'} iconSize={13} />}
        iconSize={14}
        className="m12"
        minimal={true}
      />
    </Popover2>
  );
};
PaymentActionsCell.cellType = CellType.Button;

export default function ExpenseFormPaymentSplitsTable({
  entries,
  error,
  onChange,
  currencyCode,
  minLines = MIN_PAYMENT_SPLIT_LINES,
}) {
  const { accounts } = useExpenseFormContext();

  const columns = useMemo(
    () => [
      {
        Header: PaymentAccountHeaderCell,
        id: 'payment_account_id',
        accessor: 'payment_account_id',
        Cell: AccountsListFieldCell,
        className: 'payment_account_id',
        disableSortBy: true,
        width: 60,
        filterAccountsByTypes: SUPPORTED_EXPENSE_PAYMENT_ACCOUNT_TYPES,
        fieldProps: { allowCreate: true },
      },
      {
        Header: PaymentAmountHeaderCell,
        accessor: 'amount',
        Cell: MoneyFieldCell,
        disableSortBy: true,
        width: 40,
        align: Align.Right,
      },
      {
        Header: '',
        accessor: 'action',
        Cell: PaymentActionsCell,
        disableSortBy: true,
        disableResizing: true,
        width: 45,
        align: Align.Center,
      },
    ],
    [],
  );

  const handleUpdateData = useCallback(
    (rowIndex, columnId, value) => {
      const newRows = compose(
        updateAutoAddNewLine(defaultPaymentSplit, ['payment_account_id']),
        updateTableCell(rowIndex, columnId, value),
      )(entries);
      saveInvoke(onChange, newRows);
    },
    [entries, onChange],
  );

  const handleRemoveRow = useCallback(
    (rowIndex) => {
      const newRows = compose(
        updateMinEntriesLines(minLines, defaultPaymentSplit),
        updateRemoveLineByIndex(rowIndex),
      )(entries);
      saveInvoke(onChange, newRows);
    },
    [minLines, entries, onChange],
  );

  return (
    <DataTableEditable
      name={'expense-form-payments'}
      columns={columns}
      data={entries}
      sticky={true}
      payload={{
        accounts,
        errors: error,
        updateData: handleUpdateData,
        removeRow: handleRemoveRow,
        autoFocus: ['payment_account_id', 0],
        currencyCode,
      }}
    />
  );
}
