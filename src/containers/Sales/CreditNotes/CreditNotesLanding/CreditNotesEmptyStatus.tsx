import React from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import { EmptyStatus } from '@/components';
import { Can, FormattedMessage as T } from '@/components';
import { CreditNoteAction, AbilitySubject } from '@/common/abilityOption';

export default function CreditNotesEmptyStatus() {
  const history = useHistory();
  return (
    <EmptyStatus
      title={<T id={'credit_note.empty_status.title'} />}
      description={
        <p>
          <T id={'credit_note.empty_status.description'} />
        </p>
      }
      action={
        <>
          <Can I={CreditNoteAction.Create} a={AbilitySubject.CreditNote}>
            <Button
              intent={Intent.PRIMARY}
              large={true}
              onClick={() => history.push('/credit-notes/new')}
            >
              <T id={'credit_note.label.new_credit_note'} />
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
