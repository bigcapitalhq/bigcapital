import React from 'react';
import { useHistory } from 'react-router-dom';
import { FormattedMessage as T } from 'components';

import { DashboardContentTable, DataTable } from 'components';

import ItemsEmptyStatus from './ItemsEmptyStatus';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';
import TableSkeletonHeader from 'components/Datatable/TableHeaderSkeleton';

import withItems from 'containers/Items/withItems';
import withItemsActions from 'containers/Items/withItemsActions';
import withAlertsActions from 'containers/Alert/withAlertActions';
import withDialogActions from 'containers/Dialog/withDialogActions';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { useItemsListContext } from './ItemsListProvider';
import { useItemsTableColumns, ItemsActionMenuList } from './components';
import { compose } from 'utils';

/**
 * Items datatable.
 */
function ItemsDataTable({
  // #withItemsActions
  setItemsTableState,

  // #withDialogAction
  openDialog,

  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  openDrawer,

  // #withItems
  itemsTableState,

  // #ownProps
  tableProps,
}) {
  // Items list context.
  const { items, pagination, isItemsLoading, isEmptyStatus, isItemsFetching } =
    useItemsListContext();

  // Datatable columns.
  const columns = useItemsTableColumns();

  // History context.
  const history = useHistory();

  // Table row class names.
  const rowClassNames = (row) => ({
    inactive: !row.original.active,
  });

  // Handle fetch data once the page index, size or sort by of the table change.
  const handleFetchData = React.useCallback(
    ({ pageSize, pageIndex, sortBy }) => {
      setItemsTableState({
        pageIndex,
        pageSize,
        sortBy,
      });
    },
    [setItemsTableState],
  );

  // Handle delete action Item.
  const handleDeleteItem = ({ id }) => {
    openAlert('item-delete', { itemId: id });
  };

  // Handle cancel/confirm item inactive.
  const handleInactiveItem = ({ id }) => {
    openAlert('item-inactivate', { itemId: id });
  };

  // Handle cancel/confirm item activate.
  const handleActivateItem = ({ id }) => {
    openAlert('item-activate', { itemId: id });
  };

  // Handle Edit item.
  const handleEditItem = ({ id }) => {
    history.push(`/items/${id}/edit`);
  };

  // Handle item make adjustment.
  const handleMakeAdjustment = ({ id }) => {
    openDialog('inventory-adjustment', { itemId: id });
  };

  // Display empty status instead of the table.
  const handleDuplicate = ({ id }) => {
    history.push(`/items/new?duplicate=${id}`, { action: id });
  };

  // Handle view detail item.
  const handleViewDetailItem = ({ id }) => {
    openDrawer('item-detail-drawer', { itemId: id });
  };

  // Cannot continue in case the items has empty status.
  if (isEmptyStatus) {
    return <ItemsEmptyStatus />;
  }

  return (
    <DashboardContentTable>
      <DataTable
        columns={columns}
        data={items}
        initialState={itemsTableState}
        loading={isItemsLoading}
        headerLoading={isItemsLoading}
        progressBarLoading={isItemsFetching}
        noInitialFetch={true}
        selectionColumn={true}
        spinnerProps={{ size: 30 }}
        expandable={false}
        sticky={true}
        rowClassNames={rowClassNames}
        pagination={true}
        manualSortBy={true}
        manualPagination={true}
        pagesCount={pagination.pagesCount}
        autoResetSortBy={false}
        autoResetPage={true}
        TableLoadingRenderer={TableSkeletonRows}
        TableHeaderSkeletonRenderer={TableSkeletonHeader}
        ContextMenu={ItemsActionMenuList}
        onFetchData={handleFetchData}
        payload={{
          onDeleteItem: handleDeleteItem,
          onEditItem: handleEditItem,
          onInactivateItem: handleInactiveItem,
          onActivateItem: handleActivateItem,
          onMakeAdjustment: handleMakeAdjustment,
          onDuplicate: handleDuplicate,
          onViewDetails: handleViewDetailItem,
        }}
        noResults={<T id={'there_is_no_items_in_the_table_yet'} />}
        {...tableProps}
      />
    </DashboardContentTable>
  );
}

export default compose(
  withItemsActions,
  withAlertsActions,
  withDrawerActions,
  withDialogActions,
  withItems(({ itemsTableState }) => ({ itemsTableState })),
)(ItemsDataTable);
