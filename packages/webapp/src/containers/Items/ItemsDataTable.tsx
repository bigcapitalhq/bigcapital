import * as FF from 'fp-ts/function';
import intl from 'react-intl-universal';
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
import { createDashboardListTable } from '@/components/Datatable/DashboardListTable';
import { DRAWERS } from '@/constants/drawers';
import { isSmallTableSize, TABLES } from '@/constants/tables';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';

const Table = createDashboardListTable({
  tableName: TABLES.ITEMS,
  rowName: 'item',
  identifierColumn: 'name',
  ActionsMenu: ItemsActionMenuList,
});

interface ItemsDataTableProps
  extends WithItemsActionsProps,
    WithAlertActionsProps,
    WithDialogActionsProps,
    WithDrawerActionsProps,
    Pick<WithItemsProps, 'itemsTableState' | 'itemsSelectedRows'> {}

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

  // Datatable columns.
  const columns = useItemsTableColumns();

  // History context.
  const history = useHistory();

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
    <Table
      columns={columns}
      data={items}
      total={pagination?.total}
      loading={isItemsLoading}
      fetching={isItemsFetching}
      compact={isSmallTableSize(itemsSettings?.tableSize)}
      query={itemsTableState}
      setQuery={setItemsTableState}
      selectedIds={itemsSelectedRows}
      setSelectedIds={setItemsSelectedRows}
      emptyMessage={intl.get('there_is_no_items_in_the_table_yet')}
      actions={payload}
    />
  );
}

export const ItemsDataTable = FF.pipe(
  ItemsDataTableInner,
  withItems(({ itemsTableState, itemsSelectedRows }) => ({
    itemsTableState,
    itemsSelectedRows,
  })),
  withDialogActions,
  withDrawerActions,
  withAlertActions,
  withItemsActions,
);
