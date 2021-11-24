import React from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import { EmptyStatus } from 'components';
import { Can, FormattedMessage as T } from 'components';
import {
  AbilitySubject,
  Manual_Journal_Abilities,
} from '../../../common/abilityOption';

export default function ManualJournalsEmptyStatus() {
  const history = useHistory();

  return (
    <EmptyStatus
      title={<T id={'manual_journals.empty_status.title'} />}
      description={
        <p>
          <T id={'manual_journals.empty_status.description'} />
        </p>
      }
      action={
        <>
          <Can
            I={Manual_Journal_Abilities.Create}
            a={AbilitySubject.ManualJournal}
          >
            <Button
              intent={Intent.PRIMARY}
              large={true}
              onClick={() => {
                history.push('/make-journal-entry');
              }}
            >
              <T id={'make_journal'} />
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
