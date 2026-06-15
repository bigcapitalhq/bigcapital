// @ts-nocheck
import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  NavbarGroup,
  Classes,
  NavbarDivider,
  Intent,
} from '@blueprintjs/core';

import { useWarehouseDetailDrawerContext } from './WarehouseTransferDetailDrawerProvider';
import { DrawerActionsBar, Icon, FormattedMessage as T } from '@/components';

import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';

import { DRAWERS } from '@/constants/drawers';
import { flow } from 'fp-ts/function';

/**
 * Warehouse transfer detail actions bar.
 */
function WarehouseTransferDetailActionsBarInner({
  // #withAlertActions
  openAlert,

  // #withDrawerActions
  closeDrawer,
}) {
  const history = useHistory();

  const { warehouseTransferId } = useWarehouseDetailDrawerContext();

  // Handle edit warehosue transfer.
  const handleEditWarehosueTransfer = () => {
    history.push(`/warehouses-transfers/${warehouseTransferId}/edit`);
    closeDrawer(DRAWERS.WAREHOUSE_TRANSFER_DETAILS);
  };

  // Handle delete warehouse transfer.
  const handleDeletetWarehosueTransfer = () => {
    openAlert('warehouse-transfer-delete', { warehouseTransferId });
  };

  return (
    <DrawerActionsBar>
      <NavbarGroup>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="pen-18" />}
          text={<T id={'warehouse_transfer.action.edit_warehouse_transfer'} />}
          onClick={handleEditWarehosueTransfer}
        />
        <NavbarDivider />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'trash-16'} iconSize={16} />}
          text={<T id={'delete'} />}
          intent={Intent.DANGER}
          onClick={handleDeletetWarehosueTransfer}
        />
      </NavbarGroup>
    </DrawerActionsBar>
  );
}

export const WarehouseTransferDetailActionsBar = flow(
  withDrawerActions,
  withAlertActions,
  withDialogActions,
)(WarehouseTransferDetailActionsBarInner);
