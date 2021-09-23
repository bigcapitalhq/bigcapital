import React from 'react';
import Icon from 'components/Icon';
import {
  Button,
  NavbarGroup,
  Classes,
  NavbarDivider,
  Intent,
  Alignment,
} from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';

import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import withDialogActions from 'containers/Dialog/withDialogActions';

import {
  If,
  DashboardRowsHeightButton,
  DashboardActionViewsList,
  DashboardFilterButton,
  AdvancedFilterPopover,
  FormattedMessage as T,
} from 'components';

import { useRefreshExpenses } from 'hooks/query/expenses';
import { useExpensesListContext } from './ExpensesListProvider';

import withExpensesActions from './withExpensesActions';
import withExpenses from './withExpenses';

import withSettingsActions from '../../Settings/withSettingsActions';
import withSettings from '../../Settings/withSettings';

import { compose } from 'utils';

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

  // Handles the new expense buttn click.
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
    addSetting('expense', 'tableSize', size);
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

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="plus" />}
          text={<T id={'new_expense'} />}
          onClick={onClickNewExpense}
        />
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
