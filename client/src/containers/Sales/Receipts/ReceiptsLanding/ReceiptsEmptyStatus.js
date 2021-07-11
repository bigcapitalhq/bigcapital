import React from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import { EmptyStatus } from 'components';
import { FormattedMessage as T } from 'components';

export default function ReceiptsEmptyStatus() {
  const history = useHistory();

  return (
    <EmptyStatus
      title={<T id={'manage_the_organization_s_services_and_products'} />}
      description={
        <p>
          <T id={'receipt_empty_status_description'} />
        </p>
      }
      action={
        <>
          <Button
            intent={Intent.PRIMARY}
            large={true}
            onClick={() => {
              history.push('/receipts/new');
            }}
          >
            <T id={'new_receipt'} />
          </Button>

          <Button intent={Intent.NONE} large={true}>
         <T id={'learn_more'}/>
          </Button>
        </>
      }
    />
  );
}
