import { Button, Intent, Menu, MenuItem } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import { useFormikContext } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { useExpensesIsForeign } from './utils';
import type { ExpenseFormValues } from './types';
import {
  Icon,
  Hint,
  ExchangeRateInputGroup,
  FormattedMessage as T,
} from '@/components';
import {
  InputGroupCell,
  MoneyFieldCell,
  AccountsListFieldCell,
  ProjectsListFieldCell,
  CheckBoxFieldCell,
} from '@/components/DataTableCells';
import { CellType, Features, Align } from '@/constants';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';

type ActionsCellRendererProps = {
  row: { index: number };
  column: { id: string };
  cell: { value: unknown };
  data: unknown;
  payload: { removeRow: (index: number) => void };
};

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
const ActionsCellRenderer: React.FC<ActionsCellRendererProps> & {
  cellType?: any;
} = ({ row: { index }, payload: { removeRow } }) => {
  const handleClickRemoveRole = () => {
    removeRow(index);
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
        // @ts-expect-error BP4 Button does not declare `iconSize`; runtime accepts it
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
      {/* @ts-expect-error Hint.content is typed as string but renders ReactNode */}
      <Hint content={<T id={'item_entries.landed.hint'} />} />
    </>
  );
};

type ExpenseAmountHeaderCellProps = {
  payload: { currencyCode: string };
};

/**
 * Expense amount header cell.
 */
export function ExpenseAmountHeaderCell({
  payload: { currencyCode },
}: ExpenseAmountHeaderCellProps) {
  return intl.get('amount_currency', { currency: currencyCode });
}

/**
 * Retrieve expense form table entries columns.
 */
export function useExpenseFormTableColumns({
  landedCost,
}: {
  landedCost: boolean;
}) {
  const { featureCan } = useFeatureCan();

  return React.useMemo(
    () => [
      {
        Header: ExpenseCategoryHeaderCell,
        id: 'expenseAccountId',
        accessor: 'expenseAccountId',
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
        moneyInputGroupProps: { 'data-testId': 'expense-entry-amount-input' },
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
              id: 'projectId',
              accessor: 'projectId',
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
              accessor: 'landedCost',
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
export function ExpensesExchangeRateInputField(props: Record<string, any>) {
  const baseCurrency = useCurrentOrganizationBaseCurrency();
  const { values } = useFormikContext<ExpenseFormValues>();

  const isForeignJouranl = useExpensesIsForeign();

  if (!isForeignJouranl) {
    return null;
  }
  return (
    <ExchangeRateInputGroup
      name={'exchangeRate'}
      fromCurrency={values.currencyCode ?? ''}
      toCurrency={baseCurrency ?? ''}
      {...props}
    />
  );
}
(
  ExpensesExchangeRateInputField as React.FC & {
    cellType?: any;
  }
).cellType = CellType.Field;
