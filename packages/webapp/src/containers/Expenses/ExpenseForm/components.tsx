// @ts-nocheck
import React, { useCallback, useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { sumBy } from 'lodash';
import {
  Button,
  Classes,
  FormGroup,
  Intent,
  Menu,
  MenuItem,
} from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import { useFormikContext } from 'formik';

import {
  Icon,
  Hint,
  ExchangeRateInputGroup,
  FormattedMessage as T,
  MoneyInputGroup,
} from '@/components';
import {
  InputGroupCell,
  MoneyFieldCell,
  AccountsListFieldCell,
  ProjectsListFieldCell,
  CheckBoxFieldCell,
} from '@/components/DataTableCells';
import { CellType, Features, Align } from '@/constants';

import { useCurrentOrganization, useFeatureCan } from '@/hooks/state';
import { useExpensesIsForeign } from './utils';

const paymentsTotalFromValues = (values) =>
  sumBy(
    (values?.payment_splits || []).filter(
      (s) => s.payment_account_id && Number(s.amount) > 0,
    ),
    (s) => Number(s.amount) || 0,
  );

/**
 * Percent cell used on category rows. Updating the percent switches the row
 * into percent mode (amount_type='percent') so the downstream amount becomes
 * computed from the payments total.
 */
const CategoryPercentCell = ({
  row: { index, original },
  column: { id },
  cell: { value: initialValue },
  payload: { errors, updateData },
}) => {
  const [value, setValue] = useState(initialValue ?? '');

  useEffect(() => {
    setValue(initialValue ?? '');
  }, [initialValue]);

  const handleBlurChange = (newValue) => {
    const parsed =
      newValue === '' || newValue === undefined ? '' : parseFloat(newValue);
    updateData(index, id, parsed);
  };

  const error = errors?.[index]?.[id];

  return (
    <FormGroup intent={error ? Intent.DANGER : null} className={Classes.FILL}>
      <MoneyInputGroup
        prefix={'%'}
        value={value}
        onChange={setValue}
        onBlurValue={handleBlurChange}
      />
    </FormGroup>
  );
};
CategoryPercentCell.cellType = CellType.Field;

/**
 * Amount cell for category rows. Falls back to MoneyFieldCell when the row
 * is in fixed mode. In percent mode the cell renders a read-only computed
 * amount so the user can see the dollar value their percent resolves to.
 */
const CategoryAmountCell = (props) => {
  const { values } = useFormikContext();
  const percent = Number(props.row.original?.percent);
  const isPercent = percent > 0;

  if (!isPercent) {
    return <MoneyFieldCell {...props} />;
  }
  const total = paymentsTotalFromValues(values);
  const computed = Math.round(((total * percent) / 100) * 1000) / 1000;

  return (
    <FormGroup className={Classes.FILL}>
      <MoneyInputGroup
        value={computed}
        disabled={true}
        onChange={() => {}}
      />
    </FormGroup>
  );
};
CategoryAmountCell.cellType = CellType.Field;

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
      <MenuItem
        intent={Intent.DANGER}
        onClick={handleClickRemoveRole}
        text={intl.get('expense.entries.remove_row')}
      />
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
  const { featureCan } = useFeatureCan();

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
        Header: () => intl.get('percent_of_total') || '% of Total',
        id: 'percent',
        accessor: 'percent',
        Cell: CategoryPercentCell,
        disableSortBy: true,
        width: 30,
        align: Align.Right,
      },
      {
        Header: ExpenseAmountHeaderCell,
        accessor: 'amount',
        Cell: CategoryAmountCell,
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
      ...(featureCan(Features.Projects)
        ? [
            {
              Header: intl.get('project'),
              id: 'project_id',
              accessor: 'project_id',
              Cell: ProjectsListFieldCell,
              className: 'project_id',
              disableSortBy: true,
              width: 40,
            },
          ]
        : []),

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
