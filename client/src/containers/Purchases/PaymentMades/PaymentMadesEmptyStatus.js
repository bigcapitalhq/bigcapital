import React from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import { EmptyStatus } from 'components';

export default function PaymentMadesEmptyStatus() {
  const history = useHistory();

  return (
    <EmptyStatus
      title={'The organization does not have invoices, yet!'}
      description={
        <p>
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout.
        </p>
      }
      action={
        <>
          <Button
            intent={Intent.PRIMARY}
            large={true}
            onClick={() => {
              history.push('/payment-mades/new');
            }}
          >
            New bill payment
          </Button>

          <Button intent={Intent.NONE} large={true}>
            Learn more
          </Button>
        </>
      }
    />
  );
}
