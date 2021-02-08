import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import ItemsViewsTabs from './ItemsViewsTabs';
import ItemsDataTable from './ItemsDataTable';

import withItemsActions from 'containers/Items/withItemsActions';
import withAlertsActions from 'containers/Alert/withAlertActions';
import withDialogActions from 'containers/Dialog/withDialogActions';
import withItems from 'containers/Items/withItems';

import { compose } from 'utils';
import { useItemsListContext } from './ItemsListProvider';

function transformPaginationToProps(pagination) {
  const { page, pageSize, total } = pagination;

  return {
    initialPageIndex: Math.max(page - 1, 0),
    initialPageSize: pageSize,
    pagesCount: Math.ceil(total / pageSize),
  };
}

function transformPaginationToQuery(query) {
  const { pageSize, pageIndex, sortBy } = query;

  return {
    page_size: pageSize,
    page: pageIndex + 1,
    ...(sortBy.length > 0
      ? {
          column_sort_by: sortBy[0].id,
          sort_order: sortBy[0].desc ? 'desc' : 'asc',
        }
      : {}),
  };
}

/**
 * Items view page.
 */
function ItemsViewPage({
  // #withAlertsActions.
  openAlert,

  // #withDialogActions
  openDialog,

  // #withItemsActions.
  setSelectedRowsItems,
  addItemsTableQueries,

  itemsTableQuery,
}) {
  const history = useHistory();

  const { pagination, isItemsFetching } = useItemsListContext();

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

  // Handle select item rows.
  const handleSelectedRowsChange = (selectedRows) => {
    const selectedRowsIds = selectedRows.map((r) => r.id);
    setSelectedRowsItems(selectedRowsIds);
  };

  // Handle Edit item.
  const handleEditItem = ({ id }) => {
    history.push(`/items/${id}/edit`);
  };

  // Handle item make adjustment.
  const handleMakeAdjustment = ({ id }) => {
    openDialog('inventory-adjustment', { itemId: id });
  };

  // Handle fetch data once the page index, size or sort by of the table change.
  const handlePaginationChange = ({ pageSize, page }) => {
    addItemsTableQueries({
      // ...transformPaginationToQuery(query),
      page,
      pageSize,
    });
  };

  const controlledState = (state) => ({
    ...state,
    pageIndex: itemsTableQuery.page - 1,
  });

  return (
    <>
      <ItemsViewsTabs />
      <ItemsDataTable
        tableProps={{
          payload: {
            onDeleteItem: handleDeleteItem,
            onEditItem: handleEditItem,
            onInactivateItem: handleInactiveItem,
            onActivateItem: handleActivateItem,
            onMakeAdjustment: handleMakeAdjustment,
          },
          ...transformPaginationToProps(pagination),
          onPaginationChange: handlePaginationChange,
          progressBarLoading: isItemsFetching,
          // useControlledState: controlledState
          // progressBarLoading: true
        }}
        onSelectedRowsChange={handleSelectedRowsChange}
      />
    </>
  );
}

export default compose(
  withAlertsActions,
  withItemsActions,
  withDialogActions,
  withItems(({ itemsTableQuery }) => ({ itemsTableQuery })),
)(ItemsViewPage);
