import React from 'react';
import { useHistory } from 'react-router-dom';
import { useItemsTableColumns, ItemsActionMenuList } from './components';
import { ItemsEmptyStatus } from './ItemsEmptyStatus';
import { useItemsListContext } from './ItemsListProvider';
import { withItems } from './withItems';
import { withItemsActions } from './withItemsActions';
import type { ItemTableRow } from './components';
import type { WithItemsProps } from './withItems';
import type { WithItemsActionsProps } from './withItemsActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import type { Row } from 'react-table';
import { FormattedMessage as T } from '@/components';
import {
  DashboardContentTable,
  DataTable,
  TableSkeletonRows,
  TableSkeletonHeader,
} from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { TABLES } from '@/constants/tables';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { useMemorizedColumnsWidths } from '@/hooks';
import { compose } from '@/utils';

interface ItemsDataTableProps
  extends WithItemsActionsProps,
    WithAlertActionsProps,
    WithDialogActionsProps,
    WithDrawerActionsProps,
    Pick<WithItemsProps, 'itemsTableState' | 'itemsSelectedRows'> {
  tableProps?: Record<string, unknown>;
}

interface ActionsMenuPayload {
  onDeleteItem: (item: ItemTableRow) => void;
  onEditItem: (item: ItemTableRow) => void;
  onInactivateItem: (item: ItemTableRow) => void;
  onActivateItem: (item: ItemTableRow) => void;
  onMakeAdjustment: (item: ItemTableRow) => void;
  onDuplicate: (item: ItemTableRow) => void;
  onViewDetails: (item: ItemTableRow) => void;
}

/**
 * Items datatable.
 */
function ItemsDataTableInner({
  // #withItemsActions
  setItemsTableState,
  setItemsSelectedRows,

  // #withDialogAction
  openDialog,

  // #withAlertActions
  openAlert,

  // #withDrawerActions
  openDrawer,

  // #withItems
  itemsTableState,
  itemsSelectedRows,

  // #ownProps
  tableProps,
}: ItemsDataTableProps) {
  // Items list context.
  const {
    items,
    pagination,
    isItemsLoading,
    isEmptyStatus,
    isItemsFetching,
    itemsSettings,
  } = useItemsListContext();
  const itemsTableSize = itemsSettings?.tableSize as string | undefined;

  // Datatable columns.
  const columns = useItemsTableColumns();

  // History context.
  const history = useHistory();

  // Table row class names.
  const rowClassNames = (row: Row<ItemTableRow>) => ({
    inactive: !row.original.active,
  });

  // Local storage memorizing columns widths.
  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.ITEMS);

  // Handle fetch data once the page index, size or sort by of the table change.
  const handleFetchData = React.useCallback(
    ({
      pageSize,
      pageIndex,
      sortBy,
    }: {
      pageSize: number;
      pageIndex: number;
      sortBy: Array<{ id: string; desc: boolean }>;
    }) => {
      setItemsTableState({
        pageIndex,
        pageSize,
        sortBy,
      });
    },
    [setItemsTableState],
  );

  // Handle selected rows change.
  const handleSelectedRowsChange = React.useCallback(
    (selectedFlatRows: Array<{ original: ItemTableRow }>) => {
      const selectedIds = selectedFlatRows?.map((row) => row.original.id) || [];
      setItemsSelectedRows(selectedIds);
    },
    [setItemsSelectedRows],
  );

  // Handle delete action Item.
  const handleDeleteItem = ({ id }: ItemTableRow) => {
    openAlert('item-delete', { itemId: id });
  };

  // Handle cancel/confirm item inactive.
  const handleInactiveItem = ({ id }: ItemTableRow) => {
    openAlert('item-inactivate', { itemId: id });
  };

  // Handle cancel/confirm item activate.
  const handleActivateItem = ({ id }: ItemTableRow) => {
    openAlert('item-activate', { itemId: id });
  };

  // Handle Edit item.
  const handleEditItem = ({ id }: ItemTableRow) => {
    history.push(`/items/${id}/edit`);
  };

  // Handle item make adjustment.
  const handleMakeAdjustment = ({ id }: ItemTableRow) => {
    openDialog('inventory-adjustment', { itemId: id });
  };

  // Display empty status instead of the table.
  const handleDuplicate = ({ id }: ItemTableRow) => {
    history.push(`/items/new?duplicate=${id}`, { action: id });
  };

  // Handle view detail item.
  const handleViewDetailItem = ({ id }: ItemTableRow) => {
    openDrawer(DRAWERS.ITEM_DETAILS, { itemId: id });
  };

  // Cannot continue in case the items has empty status.
  if (isEmptyStatus) {
    return <ItemsEmptyStatus />;
  }

  // Handle cell click.
  const handleCellClick = (
    cell: { row: { original: ItemTableRow } },
    _event: React.MouseEvent,
  ) => {
    openDrawer(DRAWERS.ITEM_DETAILS, { itemId: cell.row.original.id });
  };

  const payload: ActionsMenuPayload = {
    onDeleteItem: handleDeleteItem,
    onEditItem: handleEditItem,
    onInactivateItem: handleInactiveItem,
    onActivateItem: handleActivateItem,
    onMakeAdjustment: handleMakeAdjustment,
    onDuplicate: handleDuplicate,
    onViewDetails: handleViewDetailItem,
  };

  return (
    <DashboardContentTable>
      <DataTable
        columns={columns}
        data={items || []}
        loading={isItemsLoading}
        headerLoading={isItemsLoading}
        progressBarLoading={isItemsFetching}
        noInitialFetch={true}
        selectionColumn={true}
        onSelectedRowsChange={handleSelectedRowsChange}
        selectedRowsIds={itemsSelectedRows}
        autoResetSelectedRows={false}
        spinnerProps={{ size: 30 }}
        expandable={false}
        sticky={true}
        rowClassNames={rowClassNames}
        pagination={true}
        initialPageSize={itemsTableState?.pageSize || 10}
        manualSortBy={true}
        manualPagination={true}
        rowsCount={pagination?.total || 0}
        autoResetSortBy={false}
        autoResetPage={true}
        TableLoadingRenderer={TableSkeletonRows}
        TableHeaderSkeletonRenderer={TableSkeletonHeader}
        ContextMenu={ItemsActionMenuList}
        onFetchData={handleFetchData}
        onCellClick={handleCellClick}
        initialColumnsWidths={initialColumnsWidths}
        onColumnResizing={handleColumnResizing}
        size={itemsTableSize}
        payload={payload}
        noResults={<T id={'there_is_no_items_in_the_table_yet'} />}
        {...tableProps}
      />
    </DashboardContentTable>
  );
}

export const ItemsDataTable = compose(
  withItemsActions,
  withAlertActions,
  withDrawerActions,
  withDialogActions,
  withItems(({ itemsTableState, itemsSelectedRows }) => ({
    itemsTableState,
    itemsSelectedRows,
  })),
)(ItemsDataTableInner);
