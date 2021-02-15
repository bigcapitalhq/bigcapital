import React from 'react';
import { useHistory } from 'react-router-dom';

import { DataTable } from 'components';

import ItemsEmptyStatus from './ItemsEmptyStatus';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';
import TableSkeletonHeader from 'components/Datatable/TableHeaderSkeleton';


import withItems from 'containers/Items/withItems';
import withItemsActions from 'containers/Items/withItemsActions';
import withAlertsActions from 'containers/Alert/withAlertActions';
import withDialogActions from 'containers/Dialog/withDialogActions';

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

  // #withItems
  itemsTableState,

  // #ownProps
  tableProps,
}) {
  // Items list context.
  const {
    items,
    pagination,
    isItemsLoading,
    isEmptyStatus,
    isItemsFetching,
  } = useItemsListContext();

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
  if (isEmptyStatus) {
    return <ItemsEmptyStatus />;
  }

  return (
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
      }}
      noResults={'There is no items in the table yet.'}
      {...tableProps}
    />
  );
}

export default compose(
  withItemsActions,
  withAlertsActions,
  withDialogActions,
  withItems(({ itemsTableState }) => ({ itemsTableState })),
)(ItemsDataTable);
