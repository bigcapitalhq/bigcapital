import { Button, Classes } from '@blueprintjs/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Can,
  DashboardActionsBar,
  FormattedMessage as T,
  Icon,
} from '@/components';
import { AbilitySubject, BudgetAction } from '@/constants/abilityOption';

/**
 * Budgets actions bar.
 */
export function BudgetsActionsBar() {
  const history = useHistory();

  // Handle the new budget button click.
  const handleNewBudgetClick = () => {
    history.push('/budgets/new');
  };

  return (
    <DashboardActionsBar>
      <Can I={BudgetAction.Create} a={AbilitySubject.Budget}>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'plus'} />}
          text={<T id={'budget.form.new_title'} />}
          onClick={handleNewBudgetClick}
        />
      </Can>
    </DashboardActionsBar>
  );
}
