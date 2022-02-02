import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Intent } from '@blueprintjs/core';
import { EmptyStatus } from 'components';
import { Can, FormattedMessage as T } from 'components';

export default function WarehouseTransfersEmptyStatus() {
  const history = useHistory();

  return (
    <EmptyStatus
      title={<T id={'the_organization_doesn_t_receive_money_yet'} />}
      description={<p></p>}
      action={
        <>
          <Button
            intent={Intent.PRIMARY}
            large={true}
            onClick={() => {
              history.push('/warehouses-transfers/new');
            }}
          >
            <T id={'warehouse_transfer.action.new_warehouse_transfer'} />
          </Button>
          <Button intent={Intent.NONE} large={true}>
            <T id={'learn_more'} />
          </Button>
        </>
      }
    />
  );
}
