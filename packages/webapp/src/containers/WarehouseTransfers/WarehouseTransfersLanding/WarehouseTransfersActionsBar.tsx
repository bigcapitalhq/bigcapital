// @ts-nocheck
import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Classes,
  NavbarDivider,
  NavbarGroup,
  Alignment,
} from '@blueprintjs/core';
import {
  Icon,
  FormattedMessage as T,
  AdvancedFilterPopover,
  DashboardFilterButton,
  DashboardRowsHeightButton,
  DashboardActionViewsList,
  DashboardActionsBar,
} from '@/components';

import { useWarehouseTransfersListContext } from './WarehouseTransfersListProvider';
import withSettings from '@/containers/Settings/withSettings';
import withSettingsActions from '@/containers/Settings/withSettingsActions';
import withWarehouseTransfers from './withWarehouseTransfers';
import withWarehouseTransfersActions from './withWarehouseTransfersActions';

import { compose } from '@/utils';

/**
 * Warehouse Transfers actions bar.
 */
function WarehouseTransfersActionsBar({
  // #withWarehouseTransfers
  warehouseTransferFilterRoles,

  // #withWarehouseTransfersActions
  setWarehouseTransferTableState,

  // #withSettings
  warehouseTransferTableSize,

  // #withSettingsActions
  addSetting,
}) {
  const history = useHistory();

  // credit note list context.
  const { WarehouseTransferView, fields, refresh } =
    useWarehouseTransfersListContext();

  // Handle new warehouse transfer button click.
  const handleClickNewWarehouseTransfer = () => {
    history.push('/warehouses-transfers/new');
  };

  // Handle click a refresh warehouse transfers
  const handleRefreshBtnClick = () => {
    refresh();
  };

  // Handle views tab change.
  const handleTabChange = (view) => {
    setWarehouseTransferTableState({ viewSlug: view ? view.slug : null });
  };

  // Handle table row size change.
  const handleTableRowSizeChange = (size) => {
    addSetting('warehouseTransfers', 'tableSize', size);
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          allMenuItem={true}
          resourceName={'warehouse_transfer'}
          views={WarehouseTransferView}
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

        <AdvancedFilterPopover
          advancedFilterProps={{
            conditions: warehouseTransferFilterRoles,
            defaultFieldKey: 'created_at',
            fields: fields,
            onFilterChange: (filterConditions) => {
              setWarehouseTransferTableState({ filterRoles: filterConditions });
            },
          }}
        >
          <DashboardFilterButton
            conditionsCount={warehouseTransferFilterRoles.length}
          />
        </AdvancedFilterPopover>

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
          initialValue={warehouseTransferTableSize}
          onChange={handleTableRowSizeChange}
        />
        <NavbarDivider />
      </NavbarGroup>
      <NavbarGroup align={Alignment.RIGHT}>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="refresh-16" iconSize={14} />}
          onClick={handleRefreshBtnClick}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(
  withSettingsActions,
  withWarehouseTransfersActions,
  withWarehouseTransfers(({ warehouseTransferTableState }) => ({
    warehouseTransferFilterRoles: warehouseTransferTableState.filterRoles,
  })),
  withSettings(({ warehouseTransferSettings }) => ({
    warehouseTransferTableSize: warehouseTransferSettings?.tableSize,
  })),
)(WarehouseTransfersActionsBar);
