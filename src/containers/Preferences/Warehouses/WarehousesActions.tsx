// @ts-nocheck
import React from 'react';
import { Button, Intent } from '@blueprintjs/core';

import { Features } from '@/constants';
import { FeatureCan, FormattedMessage as T, Icon } from '@/components';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

/**
 * Warehouse actions.
 */
function WarehousesActions({
  //#ownProps
  openDialog,
}) {
  const handleClickNewWarehouse = () => {
    openDialog('warehouse-form');
  };

  return (
    <React.Fragment>
      <FeatureCan feature={Features.Warehouses}>
        <Button
          icon={<Icon icon="plus" iconSize={12} />}
          onClick={handleClickNewWarehouse}
          intent={Intent.PRIMARY}
        >
          <T id={'warehouses.label.new_warehouse'} />
        </Button>
      </FeatureCan>
    </React.Fragment>
  );
}

export default compose(withDialogActions)(WarehousesActions);
