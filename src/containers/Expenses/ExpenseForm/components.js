import React from 'react';
import { Button, Menu, MenuItem } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import intl from 'react-intl-universal';
import { useFormikContext } from 'formik';

import {
  Icon,
  Hint,
  ExchangeRateInputGroup,
  FormattedMessage as T,
} from 'components';
import {
  InputGroupCell,
  MoneyFieldCell,
  AccountsListFieldCell,
  CheckBoxFieldCell,
} from 'components/DataTableCells';
import { CellType, Align } from 'common';

import { useCurrentOrganization } from 'hooks/state';
import { useExpensesIsForeign } from './utils';

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
  const handleClickRemoveRole = () => {
    payload.removeRow(index);
  };
  const exampleMenu = (
    <Menu>
      <MenuItem onClick={handleClickRemoveRole} text="Remove line" />
    </Menu>
  );
  return (
    <Popover2 content={exampleMenu} placement="left-start">
      <Button
        icon={<Icon icon={'more-13'} iconSize={13} />}
        iconSize={14}
        className="m12"
        minimal={true}
      />
    </Popover2>
  );
};
ActionsCellRenderer.cellType = CellType.Button;

/**
 * Landed cost header cell.
 */
const LandedCostHeaderCell = () => {
  return (
    <>
      <T id={'landed'} />
      <Hint content={<T id={'item_entries.landed.hint'} />} />
    </>
  );
};

/**
 * Expense amount header cell.
 */
export function ExpenseAmountHeaderCell({ payload: { currencyCode } }) {
  return intl.get('amount_currency', { currency: currencyCode });
}

/**
 * Retrieve expense form table entries columns.
 */
export function useExpenseFormTableColumns({ landedCost }) {
  return React.useMemo(
    () => [
      {
        Header: ExpenseCategoryHeaderCell,
        id: 'expense_account_id',
        accessor: 'expense_account_id',
        Cell: AccountsListFieldCell,
        className: 'expense_account_id',
        disableSortBy: true,
        width: 40,
        filterAccountsByRootTypes: ['expense'],
        fieldProps: { allowCreate: true },
      },
      {
        Header: ExpenseAmountHeaderCell,
        accessor: 'amount',
        Cell: MoneyFieldCell,
        disableSortBy: true,
        width: 40,
        align: Align.Right,
      },
      {
        Header: intl.get('description'),
        accessor: 'description',
        Cell: InputGroupCell,
        disableSortBy: true,
        width: 100,
      },
      ...(landedCost
        ? [
            {
              Header: LandedCostHeaderCell,
              accessor: 'landed_cost',
              Cell: CheckBoxFieldCell,
              disableSortBy: true,
              disableResizing: true,
              width: 100,
              align: Align.Center,
            },
          ]
        : []),
      {
        Header: '',
        accessor: 'action',
        Cell: ActionsCellRenderer,
        disableSortBy: true,
        disableResizing: true,
        width: 45,
        align: Align.Center,
      },
    ],
    [],
  );
}
/**
 * Expense exchange rate input field.
 * @returns {JSX.Element}
 */
export function ExpensesExchangeRateInputField({ ...props }) {
  const currentOrganization = useCurrentOrganization();
  const { values } = useFormikContext();

  const isForeignJouranl = useExpensesIsForeign();

  // Can't continue if the customer is not foreign.
  if (!isForeignJouranl) {
    return null;
  }
  return (
    <ExchangeRateInputGroup
      fromCurrency={values.currency_code}
      toCurrency={currentOrganization.base_currency}
      {...props}
    />
  );
}
ExpensesExchangeRateInputField.cellType = CellType.Field;