import { Button, Intent } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import { Can, EmptyStatus, FormattedMessage as T } from '@/components';
import { AbilitySubject, BudgetAction } from '@/constants/abilityOption';

/**
 * Budgets list empty status.
 */
export function BudgetsEmptyStatus() {
  const history = useHistory();

  return (
    <EmptyStatus
      title={<T id={'budget.empty'} />}
      description={
        <p>
          <T id={'budget.empty_desc'} />
        </p>
      }
      action={
        <Can I={BudgetAction.Create} a={AbilitySubject.Budget}>
          <Button
            intent={Intent.PRIMARY}
            large={true}
            onClick={() => history.push('/budgets/new')}
          >
            <T id={'budget.form.new_title'} />
          </Button>
        </Can>
      }
    />
  );
}
