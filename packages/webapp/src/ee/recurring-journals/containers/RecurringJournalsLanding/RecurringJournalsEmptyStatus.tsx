import { Button, Intent } from '@blueprintjs/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Can, EmptyStatus, FormattedMessage as T } from '@/components';
import {
  AbilitySubject,
  RecurringJournalAction,
} from '@/constants/abilityOption';

export function RecurringJournalsEmptyStatus() {
  const history = useHistory();

  return (
    <EmptyStatus
      title={<T id={'recurring_journal.empty.title'} />}
      description={<T id={'recurring_journal.empty.description'} />}
      action={
        <Can
          I={RecurringJournalAction.Create}
          a={AbilitySubject.RecurringJournal}
        >
          <Button
            intent={Intent.PRIMARY}
            large={true}
            onClick={() => history.push('/recurring-journals/new')}
          >
            <T id={'new_recurring_journal'} />
          </Button>
        </Can>
      }
    />
  );
}
