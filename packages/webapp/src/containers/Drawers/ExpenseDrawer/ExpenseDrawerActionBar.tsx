import {
  Button,
  Classes,
  NavbarGroup,
  Intent,
  NavbarDivider,
} from '@blueprintjs/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useExpenseDrawerContext } from './ExpenseDrawerProvider';
import {
  Icon,
  DrawerActionsBar,
  Can,
  FormattedMessage as T,
} from '@/components';
import { ExpenseAction, AbilitySubject } from '@/constants/abilityOption';
import { DRAWERS } from '@/constants/drawers';
import {
  withAlertActions,
  WithAlertActionsProps,
} from '@/containers/Alert/withAlertActions';
import {
  withDrawerActions,
  WithDrawerActionsProps,
} from '@/containers/Drawer/withDrawerActions';
import { compose } from '@/utils';

interface ExpenseDrawerActionBarInnerProps
  extends WithAlertActionsProps,
    WithDrawerActionsProps {}

/**
 * Expense drawer action bar.
 */
function ExpenseDrawerActionBarInner({
  openAlert,
  closeDrawer,
}: ExpenseDrawerActionBarInnerProps) {
  const history = useHistory();

  // Expense drawer context.
  const { expense } = useExpenseDrawerContext();

  // Handle the expense edit action.
  const handleEditExpense = () => {
    history.push(`/expenses/${expense?.id}/edit`);
    closeDrawer(DRAWERS.EXPENSE_DETAILS);
  };

  // Handle the expense delete action.
  const handleDeleteExpense = () => {
    openAlert('expense-delete', { expenseId: expense?.id });
  };

  return (
    <DrawerActionsBar>
      <NavbarGroup>
        <Can I={ExpenseAction.Edit} a={AbilitySubject.Expense}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="pen-18" />}
            text={<T id={'edit_expense'} />}
            onClick={handleEditExpense}
          />
        </Can>
        <Can I={ExpenseAction.Delete} a={AbilitySubject.Expense}>
          <NavbarDivider />
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="trash-16" iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={handleDeleteExpense}
          />
        </Can>
      </NavbarGroup>
    </DrawerActionsBar>
  );
}

export const ExpenseDrawerActionBar = compose(
  withAlertActions,
  withDrawerActions,
)(ExpenseDrawerActionBarInner);
