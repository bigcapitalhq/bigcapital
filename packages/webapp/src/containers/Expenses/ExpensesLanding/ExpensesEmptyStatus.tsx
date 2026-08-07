import { Button, Intent } from '@blueprintjs/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { EmptyStatus, Can, FormattedMessage as T } from '@/components';
import { AbilitySubject, ExpenseAction } from '@/constants/abilityOption';

// Note: the export name `InvoicesEmptyStatus` is a copy-paste artifact from the
// @ts-nocheck original — preserved to avoid breaking the re-export in
// `ExpenseDataTable.tsx` (`InvoicesEmptyStatus as ExpensesEmptyStatus`).
export function InvoicesEmptyStatus() {
  const history = useHistory();

  return (
    <EmptyStatus
      title={<T id={'expenses.empty_status.title'} />}
      description={
        <p>
          <T id={'expenses.empty_status.description'} />
        </p>
      }
      action={
        <>
          <Can I={ExpenseAction.Create} a={AbilitySubject.Expense}>
            <Button
              intent={Intent.PRIMARY}
              large={true}
              onClick={() => {
                history.push('/expenses/new');
              }}
            >
              <T id={'new_expense'} />
            </Button>

            <Button intent={Intent.NONE} large={true}>
              <T id={'learn_more'} />
            </Button>
          </Can>
        </>
      }
    />
  );
}
