import {
  Button,
  Classes,
  Intent,
  NavbarDivider,
  NavbarGroup,
} from '@blueprintjs/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useWarehouseDetailDrawerContext } from './WarehouseTransferDetailDrawerProvider';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { DrawerActionsBar, FormattedMessage as T, Icon } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { compose } from '@/utils';

interface WarehouseTransferDetailActionsBarProps
  extends WithAlertActionsProps,
    WithDrawerActionsProps {}

function WarehouseTransferDetailActionsBarInner({
  openAlert,
  closeDrawer,
}: WarehouseTransferDetailActionsBarProps): React.ReactElement {
  const history = useHistory();

  const { warehouseTransferId } = useWarehouseDetailDrawerContext();

  const handleEditWarehosueTransfer = () => {
    history.push(`/warehouses-transfers/${warehouseTransferId}/edit`);
    closeDrawer(DRAWERS.WAREHOUSE_TRANSFER_DETAILS);
  };

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

export const WarehouseTransferDetailActionsBar = compose(
  withDrawerActions,
  withAlertActions,
)(WarehouseTransferDetailActionsBarInner);
