import React from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import { EmptyStatus } from 'components';

export default function BillsEmptyStatus() {
  const history = useHistory();

  return (
    <EmptyStatus
      title={'Manage the organization’s services and products.'}
      description={
        <p>
          Here a list of your organization products and services, to be used when you create invoices or bills to your customers or vendors.
        </p>
      }
      action={
        <>
          <Button
            intent={Intent.PRIMARY}
            large={true}
            onClick={() => {
              history.push('/bills/new');
            }}
          >
            New bill
          </Button>

          <Button intent={Intent.NONE} large={true}>
            Learn more
          </Button>
        </>
      }
    />
  );
}
