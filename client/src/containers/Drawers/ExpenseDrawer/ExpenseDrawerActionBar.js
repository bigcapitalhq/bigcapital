import React from 'react';
import { useHistory } from 'react-router-dom';
import Icon from 'components/Icon';
import { Button, Classes, NavbarGroup, Intent } from '@blueprintjs/core';
import { FormattedMessage as T } from 'components';
import { safeCallback } from 'utils';

import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import withAlertsActions from 'containers/Alert/withAlertActions';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { compose } from 'utils';

/**
 * Expense drawer action bar.
 */
function ExpenseDrawerActionBar({
  // #ownProps
  expense,

  // #withAlertsDialog
  openAlert,

  // #withDrawerActions
  closeDrawer,
}) {
  const history = useHistory();

  // Handle the expense edit action.
  const onEditExpense = () => {
    if (expense) {
      history.push(`/expenses/${expense.id}/edit`);
      closeDrawer('expense-drawer');
    }
  };

  // Handle the expense delete action.
  const onDeleteExpense = () => {
    if (expense) {
      openAlert('expense-delete', { expenseId: expense.id });
      closeDrawer('expense-drawer');
    }
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="pen-18" />}
          text={<T id={'edit_expense'} />}
          onClick={safeCallback(onEditExpense)}
        />

        <Button
          className={Classes.MINIMAL}
          icon={<Icon style={{ color: 'red' }} icon="trash-18" iconSize={18} />}
          text={<T id={'delete'} />}
          // intent={Intent.DANGER}
          onClick={safeCallback(onDeleteExpense)}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(
  withAlertsActions,
  withDrawerActions,
)(ExpenseDrawerActionBar);
