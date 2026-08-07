import { Button, NavbarGroup, Classes, Intent } from '@blueprintjs/core';
import React from 'react';
import { useInventoryAdjustmentDrawerContext } from './InventoryAdjustmentDrawerProvider';
import {
  Icon,
  DrawerActionsBar,
  FormattedMessage as T,
  Can,
} from '@/components';
import {
  InventoryAdjustmentAction,
  AbilitySubject,
} from '@/constants/abilityOption';
import {
  withAlertActions,
  WithAlertActionsProps,
} from '@/containers/Alert/withAlertActions';
import { compose } from '@/utils';

interface InventoryAdjustmentDetailActionsBarInnerProps
  extends Pick<WithAlertActionsProps, 'openAlert'> {}

/**
 * Inventory adjustment detail actions bar.
 */
function InventoryAdjustmentDetailActionsBarInner({
  openAlert,
}: InventoryAdjustmentDetailActionsBarInnerProps) {
  const { inventoryId } = useInventoryAdjustmentDrawerContext();

  const handleDeleteInventoryAdjustment = () => {
    openAlert('inventory-adjustment-delete', { inventoryId });
  };

  return (
    <Can
      I={InventoryAdjustmentAction.Delete}
      a={AbilitySubject.InventoryAdjustment}
    >
      <DrawerActionsBar>
        <NavbarGroup>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'trash-16'} iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={handleDeleteInventoryAdjustment}
          />
        </NavbarGroup>
      </DrawerActionsBar>
    </Can>
  );
}

export const InventoryAdjustmentDetailActionsBar = compose(withAlertActions)(
  InventoryAdjustmentDetailActionsBarInner,
);
