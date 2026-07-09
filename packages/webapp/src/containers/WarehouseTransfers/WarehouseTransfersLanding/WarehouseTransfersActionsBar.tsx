import {
  Button,
  Classes,
  NavbarDivider,
  NavbarGroup,
  Alignment,
} from '@blueprintjs/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useWarehouseTranfersListContext } from './WarehouseTransfersListProvider';
import { withWarehouseTransfers } from './withWarehouseTransfers';
import { withWarehouseTransfersActions } from './withWarehouseTransfersActions';
import type { WithWarehouseTransfersActionsProps } from './withWarehouseTransfersActions';
import {
  Icon,
  FormattedMessage as T,
  AdvancedFilterPopover,
  DashboardFilterButton,
  DashboardRowsHeightButton,
  DashboardActionViewsList,
  DashboardActionsBar,
} from '@/components';
import { withSettings } from '@/containers/Settings/withSettings';
import type { WithSettingsProps } from '@/containers/Settings/withSettings';
import { withSettingsActions } from '@/containers/Settings/withSettingsActions';
import type { WithSettingsActionsProps } from '@/containers/Settings/withSettingsActions';
import { compose } from '@/utils';

interface WarehouseTransfersActionsBarInnerProps
  extends Pick<
    WithWarehouseTransfersActionsProps,
    'setWarehouseTransferTableState'
  > {
  warehouseTransferFilterRoles: unknown[];
  warehouseTransferTableSize?: unknown;
  addSetting: WithSettingsActionsProps['addSetting'];
}

interface FilterCondition {
  fieldKey: string;
}

interface ViewOption {
  slug?: string;
}

/**
 * Warehouse Transfers actions bar.
 */
function WarehouseTransfersActionsBarInner({
  // #withWarehouseTransfers
  warehouseTransferFilterRoles,

  // #withWarehouseTransfersActions
  setWarehouseTransferTableState,

  // #withSettings
  warehouseTransferTableSize,

  // #withSettingsActions
  addSetting,
}: WarehouseTransfersActionsBarInnerProps) {
  const history = useHistory();

  // credit note list context.
  const { WarehouseTransferView, fields, refresh } =
    useWarehouseTranfersListContext();

  // Handle new warehouse transfer button click.
  const handleClickNewWarehouseTransfer = () => {
    history.push('/warehouses-transfers/new');
  };

  // Handle click a refresh warehouse transfers
  const handleRefreshBtnClick = () => {
    refresh();
  };

  // Handle views tab change.
  const handleTabChange = (view: ViewOption | null) => {
    setWarehouseTransferTableState({ viewSlug: view ? view.slug : null });
  };

  // Handle table row size change.
  const handleTableRowSizeChange = (size: string) => {
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
            conditions: warehouseTransferFilterRoles as FilterCondition[],
            defaultFieldKey: 'created_at',
            fields: fields,
            onFilterChange: (filterConditions: unknown) => {
              setWarehouseTransferTableState({
                filterRoles: filterConditions as never,
              });
            },
          }}
        >
          <DashboardFilterButton
            conditionsCount={warehouseTransferFilterRoles.length}
          />
        </AdvancedFilterPopover>

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'print-16'} iconSize={16} />}
          text={<T id={'print'} />}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'file-import-16'} />}
          text={<T id={'import'} />}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'file-export-16'} iconSize={16} />}
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

export const WarehouseTransfersActionsBar = compose(
  withSettingsActions,
  withWarehouseTransfersActions,
  withWarehouseTransfers(({ warehouseTransferTableState }) => ({
    warehouseTransferFilterRoles: warehouseTransferTableState?.filterRoles ?? [],
  })),
  withSettings(({ warehouseTransferSettings }: WithSettingsProps) => ({
    warehouseTransferTableSize: warehouseTransferSettings?.tableSize,
  })),
)(WarehouseTransfersActionsBarInner);
