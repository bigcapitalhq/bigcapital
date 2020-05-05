import React, { useEffect, useCallback, useState } from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';
import {
  Intent,
  Alert,
} from '@blueprintjs/core';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import useAsync from 'hooks/async';
import ItemsActionsBar from 'containers/Dashboard/Items/ItemsActionsBar';
import { compose } from 'utils';
import ItemsDataTable from './ItemsDataTable';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import ResourceConnect from 'connectors/Resource.connector';
import DashboardConnect from 'connectors/Dashboard.connector';
import ItemsConnect from 'connectors/Items.connect';
import CustomViewsConnect from 'connectors/CustomView.connector'
import ItemsViewsTabs from 'containers/Dashboard/Items/ItemsViewsTabs';
import AppToaster from 'components/AppToaster';


function ItemsList({
  changePageTitle,
  fetchResourceViews,
  fetchResourceFields,
  views,
  requestDeleteItem,
  requestFetchItems,
  addItemsTableQueries,
}) {
  const [deleteItem, setDeleteItem] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    changePageTitle('Items List');
  }, [changePageTitle]);

  const fetchHook = useAsync(async () => {
    await Promise.all([
      fetchResourceViews('items'),
      fetchResourceFields('items'),
    ]);
  });

  const fetchItems = useAsync(async () => {
    await Promise.all([
      requestFetchItems({  }),
    ])
  });

  // Handle click delete item.
  const handleDeleteItem = useCallback((item) => {
    setDeleteItem(item);
  }, [setDeleteItem]);

  const handleEditItem = () => {};

  // Handle cancel delete the item.
  const handleCancelDeleteItem = useCallback(() => {
    setDeleteItem(false);
  }, [setDeleteItem]);

  // handle confirm delete item.
  const handleConfirmDeleteItem = useCallback(() => {
    requestDeleteItem(deleteItem.id).then(() => {
      AppToaster.show({ message: 'the_item_has_been_deleted' });
      setDeleteItem(false);
    });
  }, [requestDeleteItem, deleteItem]);

  const handleFetchData = useCallback(({ pageIndex, pageSize, sortBy  }) => {
    addItemsTableQueries({
      ...(sortBy.length > 0) ? {
        column_sort_order: sortBy[0].id,
        sort_order: sortBy[0].desc ? 'desc' : 'asc',
      } : {},
    });
    fetchItems.execute();
  }, [fetchItems, addItemsTableQueries]);

  // Handle filter change to re-fetch the items.
  const handleFilterChanged = useCallback(() => {
    fetchItems.execute();
  }, [fetchItems]);

  // Handle custom view change to re-fetch the items.
  const handleCustomViewChanged = useCallback(() => {    
    fetchItems.execute();
  }, [fetchItems]);

  // Handle selected rows change.
  const handleSelectedRowsChange = useCallback((accounts) => {
    setSelectedRows(accounts);
  }, [setSelectedRows]);
  
  return (
    <DashboardInsider isLoading={fetchHook.pending} name={'items-list'}>
      <ItemsActionsBar
        onFilterChanged={handleFilterChanged}
        selectedRows={selectedRows}
        views={views} />

      <DashboardPageContent>
        <Switch>
          <Route
            exact={true}
            path={[
              '/dashboard/items/:custom_view_id/custom_view',
              '/dashboard/items'
            ]}>
            <ItemsViewsTabs
              onViewChanged={handleCustomViewChanged} />

            <ItemsDataTable
              onDeleteItem={handleDeleteItem}
              onEditItem={handleEditItem}
              onFetchData={handleFetchData}
              onSelectedRowsChange={handleSelectedRowsChange} />

            <Alert
              cancelButtonText="Cancel"
              confirmButtonText="Move to Trash"
              icon="trash"
              intent={Intent.DANGER}
              isOpen={deleteItem}
              onCancel={handleCancelDeleteItem}
              onConfirm={handleConfirmDeleteItem}>
              <p>
              Are you sure you want to move <b>filename</b> to Trash? You will be able to restore it later,
              but it will become private to you.
              </p>
            </Alert>
          </Route>
        </Switch>
      </DashboardPageContent>
    </DashboardInsider>
  )
}

export default compose(
  DashboardConnect,
  ResourceConnect,
  ItemsConnect,
  CustomViewsConnect,
)(ItemsList);
