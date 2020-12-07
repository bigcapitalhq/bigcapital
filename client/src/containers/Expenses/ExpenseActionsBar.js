import React, { useMemo, useCallback, useState } from 'react';
import Icon from 'components/Icon';
import {
  Button,
  NavbarGroup,
  Classes,
  NavbarDivider,
  MenuItem,
  Menu,
  Popover,
  PopoverInteractionKind,
  Position,
  Intent,
} from '@blueprintjs/core';
import classNames from 'classnames';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { FormattedMessage as T } from 'react-intl';
import { connect } from 'react-redux';

import FilterDropdown from 'components/FilterDropdown';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import withDialogActions from 'containers/Dialog/withDialogActions';

import { If, DashboardActionViewsList } from 'components';

import withResourceDetail from 'containers/Resources/withResourceDetails';
import withExpenses from 'containers/Expenses/withExpenses';
import withExpensesActions from 'containers/Expenses/withExpensesActions';

import { compose } from 'utils';

/**
 * Expenses actions bar.
 */
function ExpensesActionsBar({
  // #withResourceDetail
  resourceFields,

  //#withExpenses
  expensesViews,

  //#withExpensesActions
  addExpensesTableQueries,
  changeExpensesView,

  onFilterChanged,
  selectedRows,
  onBulkDelete,
}) {
  const [filterCount, setFilterCount] = useState(0);
  const history = useHistory();

  const onClickNewExpense = useCallback(() => {
    history.push('/expenses/new');
  }, [history]);

  const filterDropdown = FilterDropdown({
    initialCondition: {
      fieldKey: 'reference_no',
      compatator: 'contains',
      value: '',
    },
    fields: resourceFields,
    onFilterChange: (filterConditions) => {
      addExpensesTableQueries({
        filter_roles: filterConditions || '',
      });
      onFilterChanged && onFilterChanged(filterConditions);
    },
  });

  const hasSelectedRows = useMemo(() => selectedRows.length > 0, [
    selectedRows,
  ]);

  // Handle delete button click.
  const handleBulkDelete = useCallback(() => {
    onBulkDelete && onBulkDelete(selectedRows.map((r) => r.id));
  }, [onBulkDelete, selectedRows]);

  const handleTabChange = (viewId) => {
    changeExpensesView(viewId.id || -1);
    addExpensesTableQueries({
      custom_view_id: viewId.id || null,
    });
  };
  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          resourceName={'expenses'}
          views={expensesViews}
          onChange={handleTabChange}
        />
        <NavbarDivider />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="plus" />}
          text={<T id={'new_expense'} />}
          onClick={onClickNewExpense}
        />
        <Popover
          minimal={true}
          content={filterDropdown}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_LEFT}
        >
          <Button
            className={classNames(Classes.MINIMAL, 'button--filter', {
              'has-active-filters': filterCount > 0,
            })}
            text="Filter"
            icon={<Icon icon="filter-16" iconSize={16} />}
          />
        </Popover>

        <If condition={hasSelectedRows}>
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
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

const mapStateToProps = (state, props) => ({
  resourceName: 'expenses',
});

const withExpensesActionsBar = connect(mapStateToProps);

export default compose(
  withExpensesActionsBar,
  withDialogActions,
  withResourceDetail(({ resourceFields }) => ({
    resourceFields,
  })),
  withExpenses(({ expensesViews }) => ({
    expensesViews,
  })),
  withExpensesActions,
)(ExpensesActionsBar);
