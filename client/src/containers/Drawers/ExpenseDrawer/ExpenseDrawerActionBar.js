import React from 'react';
import { useHistory } from 'react-router-dom';
import Icon from 'components/Icon';
import {
  Button,
  Classes,
  NavbarGroup,
  Intent,
  NavbarDivider,
} from '@blueprintjs/core';
import { FormattedMessage as T } from 'components';

import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import withAlertsActions from 'containers/Alert/withAlertActions';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { compose } from 'utils';
import { useExpenseDrawerContext } from './ExpenseDrawerProvider';

/**
 * Expense drawer action bar.
 */
function ExpenseDrawerActionBar({
  // #withAlertsDialog
  openAlert,

  // #withDrawerActions
  closeDrawer,
}) {
  const history = useHistory();
  const { expense } = useExpenseDrawerContext();

  // Handle the expense edit action.
  const handleEditExpense = () => {
    history.push(`/expenses/${expense.id}/edit`);
    closeDrawer('expense-drawer');
  };

  // Handle the expense delete action.
  const handleDeleteExpense = () => {
    openAlert('expense-delete', { expenseId: expense.id });
    closeDrawer('expense-drawer');
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="pen-18" />}
          text={<T id={'edit_expense'} />}
          onClick={handleEditExpense}
        />
        <NavbarDivider />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="trash-16" iconSize={16} />}
          text={<T id={'delete'} />}
          intent={Intent.DANGER}
          onClick={handleDeleteExpense}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(
  withAlertsActions,
  withDrawerActions,
)(ExpenseDrawerActionBar);
