import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Classes,
  NavbarDivider,
  NavbarGroup,
  Intent,
  Alignment,
} from '@blueprintjs/core';
import {
  Icon,
  FormattedMessage as T,
  AdvancedFilterPopover,
  DashboardFilterButton,
  DashboardRowsHeightButton,
  DashboardActionViewsList,
} from 'components';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';

import withSettingsActions from 'containers/Settings/withSettingsActions';

import { compose } from 'utils';

/**
 * Warehouse Transfers actions bar.
 */
function WarehouseTransfersActionsBar({
  // #withSettingsActions
  addSetting,
}) {
  const history = useHistory();

  // Handle new warehouse transfer button click.
  const handleClickNewWarehouseTransfer = () => {
    history.push('/warehouses-transfers/new');
  };

  // Handle click a refresh warehouse transfers
  const handleRefreshBtnClick = () => {
    // refresh();
  };

  // Handle views tab change.
  const handleTabChange = (view) => {};

  // Handle table row size change.
  const handleTableRowSizeChange = (size) => {};
  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          resourceName={''}
          views={[]}
          onChange={handleTabChange}
        />
        <NavbarDivider />

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'plus'} />}
          text={<T id={'warehouse_transfer.action.new_warehouse_transfer'} />}
          onClick={handleClickNewWarehouseTransfer}
        />
        <NavbarDivider />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'print-16'} iconSize={'16'} />}
          text={<T id={'print'} />}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'file-import-16'} />}
          text={<T id={'import'} />}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'file-export-16'} iconSize={'16'} />}
          text={<T id={'export'} />}
        />
        <NavbarDivider />
        <DashboardRowsHeightButton
        // initialValue={warehouseTransfersTableSize}
        // onChange={handleTableRowSizeChange}
        />
        <NavbarDivider />
      </NavbarGroup>
      <NavbarGroup align={Alignment.RIGHT}>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="refresh-16" iconSize={14} />}
          // onClick={handleRefreshBtnClick}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(withSettingsActions)(WarehouseTransfersActionsBar);
