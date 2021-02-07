import React from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';

import ItemsViewsTabs from './ItemsViewsTabs';
import ItemsDataTable from './ItemsDataTable';

import withItemsActions from 'containers/Items/withItemsActions';
import withAlertsActions from 'containers/Alert/withAlertActions';
import withDialogActions from 'containers/Dialog/withDialogActions';

import { compose } from 'utils';

function ItemsViewPage({
  // #withAlertsActions.
  openAlert,

  // #withDialogActions
  openDialog,

  // #withItemsActions.
  setSelectedRowsItems,
  addItemsTableQueries
}) {
  const history = useHistory();

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
  }

  // Handle fetch data once the page index, size or sort by of the table change.
  const handleFetchData = ({ pageIndex, pageSize, sortBy }) => {
    addItemsTableQueries({
      page_size: pageSize,
      page: pageIndex,
      ...(sortBy.length > 0
        ? {
            column_sort_by: sortBy[0].id,
            sort_order: sortBy[0].desc ? 'desc' : 'asc',
          }
        : {}),
    });
  };

  return (
    <Switch>
      <Route
        exact={true}
        path={['/items/:custom_view_id/custom_view', '/items']}
      >
        <ItemsViewsTabs />
        <ItemsDataTable
          tableProps={{
            payload: {
              onDeleteItem: handleDeleteItem,
              onEditItem: handleEditItem,
              onInactivateItem: handleInactiveItem,
              onActivateItem: handleActivateItem,
              onMakeAdjustment: handleMakeAdjustment
            },
            onFetchData: handleFetchData
          }}
          onSelectedRowsChange={handleSelectedRowsChange}
        />
      </Route>
    </Switch>
  );
}

export default compose(
  withAlertsActions,
  withItemsActions,
  withDialogActions
)(ItemsViewPage);
