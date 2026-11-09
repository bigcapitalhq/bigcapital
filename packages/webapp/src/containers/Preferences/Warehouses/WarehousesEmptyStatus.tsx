import { Button, Intent } from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import React from 'react';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { EmptyStatus, FormattedMessage as T } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';

interface WarehousesEmptyStatusProps extends WithDialogActionsProps {}

function WarehousesEmptyStatusInner({
  openDialog,
}: WarehousesEmptyStatusProps): React.ReactElement {
  const handleActivateWarehouse = () => {
    openDialog('warehouse-activate', {});
  };

  return (
    <EmptyStatus
      title={<T id={'warehouses.empty_status.title'} />}
      description={
        <p>
          <T id={'warehouses.empty_status.description'} />
        </p>
      }
      action={
        <React.Fragment>
          <Button
            intent={Intent.PRIMARY}
            large={true}
            onClick={handleActivateWarehouse}
          >
            <T id={'warehouses.activate_button'} />
          </Button>
        </React.Fragment>
      }
    />
  );
}

export const WarehousesEmptyStatus = FF.pipe(
  WarehousesEmptyStatusInner,
  withDialogActions,
);
