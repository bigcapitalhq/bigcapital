import React from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import { EmptyStatus } from 'components';
import { FormattedMessage as T } from 'components';

export default function InvoicesEmptyStatus() {
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
        </>
      }
    />
  );
}
