import {
  Button,
  NavbarGroup,
  Classes,
  NavbarDivider,
  Intent,
} from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
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
import { DialogsName } from '@/constants/dialogs';
import { DRAWERS } from '@/constants/drawers';
import {
  withAlertActions,
  WithAlertActionsProps,
} from '@/containers/Alert/withAlertActions';
import {
  withDialogActions,
  WithDialogActionsProps,
} from '@/containers/Dialog/withDialogActions';
import {
  withDrawerActions,
  WithDrawerActionsProps,
} from '@/containers/Drawer/withDrawerActions';

interface InventoryAdjustmentDetailActionsBarInnerProps
  extends Pick<WithAlertActionsProps, 'openAlert'>,
    WithDialogActionsProps,
    WithDrawerActionsProps {}

/**
 * Inventory adjustment detail actions bar.
 */
function InventoryAdjustmentDetailActionsBarInner({
  openAlert,
  openDialog,
  closeDrawer,
}: InventoryAdjustmentDetailActionsBarInnerProps) {
  const { inventoryId } = useInventoryAdjustmentDrawerContext();

  // Handle edit inventory adjustment.
  const handleEditInventoryAdjustment = () => {
    openDialog(DialogsName.InventoryAdjustmentForm, {
      action: 'edit',
      inventoryId,
    });
    closeDrawer(DRAWERS.INVENTORY_ADJUSTMENT_DETAILS);
  };

  const handleDeleteInventoryAdjustment = () => {
    openAlert('inventory-adjustment-delete', { inventoryId });
  };

  return (
    <DrawerActionsBar>
      <NavbarGroup>
        <Can
          I={InventoryAdjustmentAction.Edit}
          a={AbilitySubject.InventoryAdjustment}
        >
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="pen-18" />}
            text={<T id={'edit'} />}
            onClick={handleEditInventoryAdjustment}
          />
        </Can>

        <Can
          I={InventoryAdjustmentAction.Delete}
          a={AbilitySubject.InventoryAdjustment}
        >
          <NavbarDivider />
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'trash-16'} iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={handleDeleteInventoryAdjustment}
          />
        </Can>
      </NavbarGroup>
    </DrawerActionsBar>
  );
}

export const InventoryAdjustmentDetailActionsBar = FF.pipe(
  InventoryAdjustmentDetailActionsBarInner,
  withAlertActions,
  withDrawerActions,
  withDialogActions,
);
