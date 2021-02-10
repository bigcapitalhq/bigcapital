import React from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import { EmptyStatus } from 'components';

export default function VendorsEmptyStatus() {
  const history = useHistory();

  return (
    <EmptyStatus
      title={"Create and manage your organization's vendors."}
      description={
        <p>
          Here a list of your organization products and services, to be used
          when you create invoices or bills to your customers or vendors.
        </p>
      }
      action={
        <>
          <Button
            intent={Intent.PRIMARY}
            large={true}
            onClick={() => {
              history.push('/vendors/new');
            }}
          >
            New vendor
          </Button>

          <Button intent={Intent.NONE} large={true}>
            Learn more
          </Button>
        </>
      }
    />
  );
}
