// @ts-nocheck
import React from 'react';
import {
  Button,
  NavbarGroup,
  Classes,
  NavbarDivider,
  Intent,
  Alignment,
} from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';

import {
  If,
  Can,
  Icon,
  DashboardRowsHeightButton,
  DashboardActionViewsList,
  DashboardActionsBar,
  DashboardFilterButton,
  AdvancedFilterPopover,
  FormattedMessage as T,
} from '@/components';

import { ExpenseAction, AbilitySubject } from '@/constants/abilityOption';
import { useRefreshExpenses } from '@/hooks/query/expenses';
import { useExpensesListContext } from './ExpensesListProvider';

import withExpenses from './withExpenses';
import withExpensesActions from './withExpensesActions';
import withSettingsActions from '@/containers/Settings/withSettingsActions';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import withSettings from '@/containers/Settings/withSettings';

import { compose } from '@/utils';

/**
 * Expenses actions bar.
 */
function ExpensesActionsBar({
  //#withExpensesActions
  setExpensesTableState,

  // #withExpenses
  expensesFilterConditions,

  // #withSettings
  expensesTableSize,

  // #withSettingsActions
  addSetting,
}) {
  // History context.
  const history = useHistory();

  // Expenses list context.
  const { expensesViews, fields } = useExpensesListContext();

  // Expenses refresh action.
  const { refresh } = useRefreshExpenses();

  // Handles the new expense button click.
  const onClickNewExpense = () => {
    history.push('/expenses/new');
  };

  // Handle delete button click.
  const handleBulkDelete = () => {};

  // Handles the tab chaning.
  const handleTabChange = (view) => {
    setExpensesTableState({
      viewSlug: view ? view.slug : null,
    });
  };

  // Handle click a refresh
  const handleRefreshBtnClick = () => {
    refresh();
  };

  // Handle table row size change.
  const handleTableRowSizeChange = (size) => {
    addSetting('expenses', 'tableSize', size);
  };
  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          resourceName={'expenses'}
          views={expensesViews}
          allMenuItem={true}
          onChange={handleTabChange}
        />
        <NavbarDivider />
        <Can I={ExpenseAction.Create} a={AbilitySubject.Expense}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="plus" />}
            text={<T id={'new_expense'} />}
            onClick={onClickNewExpense}
          />
        </Can>
        <AdvancedFilterPopover
          advancedFilterProps={{
            conditions: expensesFilterConditions,
            defaultFieldKey: 'reference_no',
            fields: fields,
            onFilterChange: (filterConditions) => {
              setExpensesTableState({ filterRoles: filterConditions });
            },
          }}
        >
          <DashboardFilterButton
            conditionsCount={expensesFilterConditions.length}
          />
        </AdvancedFilterPopover>

        <If condition={false}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="trash-16" iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={handleBulkDelete}
          />
        </If>

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="print-16" iconSize={16} />}
          text={<T id={'print'} />}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="file-import-16" iconSize={16} />}
          text={<T id={'import'} />}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="file-export-16" iconSize={16} />}
          text={<T id={'export'} />}
        />
        <NavbarDivider />
        <DashboardRowsHeightButton
          initialValue={expensesTableSize}
          onChange={handleTableRowSizeChange}
        />
        <NavbarDivider />
      </NavbarGroup>
      <NavbarGroup align={Alignment.RIGHT}>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="refresh-16" iconSize={14} />}
          onClick={handleRefreshBtnClick}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(
  withDialogActions,
  withExpensesActions,
  withSettingsActions,
  withExpenses(({ expensesTableState }) => ({
    expensesFilterConditions: expensesTableState.filterRoles,
  })),
  withSettings(({ expenseSettings }) => ({
    expensesTableSize: expenseSettings?.tableSize,
  })),
)(ExpensesActionsBar);
