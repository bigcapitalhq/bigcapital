// @ts-nocheck
import React from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { FormattedMessage as T, EmptyStatus } from '@/components';
import withDialogActions from '@/containers/Dialog/withDialogActions';

import { compose } from '@/utils';

function WarehousesEmptyStatus({
  // #withDialogActions
  openDialog,
}) {
  // Handle activate action warehouse.
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

export default compose(withDialogActions)(WarehousesEmptyStatus);
