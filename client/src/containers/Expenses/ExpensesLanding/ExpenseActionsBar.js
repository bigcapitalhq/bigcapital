import React, { useCallback, useState } from 'react';
import Icon from 'components/Icon';
import {
  Button,
  NavbarGroup,
  Classes,
  NavbarDivider,
  Popover,
  PopoverInteractionKind,
  Position,
  Intent,
} from '@blueprintjs/core';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { FormattedMessage as T } from 'react-intl';

import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import withDialogActions from 'containers/Dialog/withDialogActions';

import { If, DashboardActionViewsList } from 'components';

import { useExpensesListContext } from './ExpensesListProvider';
import withExpensesActions from './withExpensesActions';

import { compose } from 'utils';

/**
 * Expenses actions bar.
 */
function ExpensesActionsBar({
  //#withExpensesActions
  setExpensesTableState,
}) {
  const [filterCount, setFilterCount] = useState(0);

  // History context.
  const history = useHistory();

  // Expenses list context.
  const { expensesViews } = useExpensesListContext();

  // Handles the new expense buttn click.
  const onClickNewExpense = () => {
    history.push('/expenses/new');
  };

  // Handle delete button click.
  const handleBulkDelete = () => {
    
  };

  // Handles the tab chaning.
  const handleTabChange = (viewId) => {
    setExpensesTableState({
      customViewId: viewId.id || null,
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
          content={''}
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
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(
  withDialogActions,
  withExpensesActions,
)(ExpensesActionsBar);
