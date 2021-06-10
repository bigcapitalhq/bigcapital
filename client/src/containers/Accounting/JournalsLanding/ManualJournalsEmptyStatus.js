import React from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import { EmptyStatus } from 'components';
import { FormattedMessage as T } from 'components';

export default function ManualJournalsEmptyStatus() {
  const history = useHistory();

  return (
    <EmptyStatus
      title={<T id={'create_your_first_journal_entries_on_accounts_chart'} />}
      description={
        <p>
          <T id={'it_is_a_long_established_fact_that_a_reader'} />
        </p>
      }
      action={
        <>
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
        </>
      }
    />
  );
}
