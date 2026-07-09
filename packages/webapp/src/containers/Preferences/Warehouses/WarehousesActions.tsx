import { Button, Intent } from '@blueprintjs/core';
import React from 'react';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { FeatureCan, FormattedMessage as T, Icon } from '@/components';
import { Features } from '@/constants';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

interface WarehousesActionsProps extends WithDialogActionsProps {}

function WarehousesActionsInner({
  openDialog,
}: WarehousesActionsProps): React.ReactElement {
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

export const WarehousesActions = compose(withDialogActions)(
  WarehousesActionsInner,
);
