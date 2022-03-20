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
import { useFormikContext } from 'formik';
import { ExchangeRateInputGroup } from 'components';
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
      ...(landedCost
        ? [
            {
              Header: LandedCostHeaderCell,
              accessor: 'landed_cost',
              Cell: CheckBoxFieldCell,
              disableSortBy: true,
              disableResizing: true,
              width: 100,
              className: 'landed-cost',
            },
          ]
        : []),
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
;

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
