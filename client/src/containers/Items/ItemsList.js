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
import { useQuery } from 'react-query';
import ItemsActionsBar from 'containers/Items/ItemsActionsBar';
import { compose } from 'utils';
import ItemsDataTable from './ItemsDataTable';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';

import ItemsViewsTabs from 'containers/Items/ItemsViewsTabs';
import AppToaster from 'components/AppToaster';

import withItems from 'containers/Items/withItems';
import withResourceActions from 'containers/Resources/withResourcesActions';
import withDashboardActions from 'containers/Dashboard/withDashboard';
import withItemsActions from 'containers/Items/withItemsActions';
import withViewsActions from 'containers/Views/withViewsActions';


function ItemsList({
  // #withDashboard
  changePageTitle,

  // #withResourceActions
  requestFetchResourceViews,
  requestFetchResourceFields,

  // #withItems
  itemsViews,
  itemsCurrentPage,
  itemsTableQuery,

  // #withItemsActions
  requestDeleteItem,
  requestFetchItems,
  addItemsTableQueries,
  changeItemsCurrentView
}) {
  const [deleteItem, setDeleteItem] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);

  useEffect(() => {
    changePageTitle('Items List');
  }, [changePageTitle]);

  const fetchHook = useQuery('items-resource', () => {
    return Promise.all([
      requestFetchResourceViews('items'),
      requestFetchResourceFields('items'),
    ]);
  });

  const fetchItems = useQuery(['items-table', itemsTableQuery],
    () => requestFetchItems({}));

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

  // Handle fetch data table.
  const handleFetchData = useCallback(({ pageIndex, pageSize, sortBy  }) => {
    addItemsTableQueries({
      ...(sortBy.length > 0) ? {
        column_sort_order: sortBy[0].id,
        sort_order: sortBy[0].desc ? 'desc' : 'asc',
      } : {},
    });
  }, [fetchItems, addItemsTableQueries]);

  // Handle filter change to re-fetch the items.
  const handleFilterChanged = useCallback((filterConditions) => {
    addItemsTableQueries({
      filter_roles: filterConditions || '',  
    });
  }, [fetchItems]);

  // Handle custom view change to re-fetch the items.
  const handleCustomViewChanged = useCallback((customViewId) => {    
    setTableLoading(true);
  }, [fetchItems]);

  useEffect(() => {
    if (tableLoading && !fetchItems.isFetching) {
      setTableLoading(false);
    }
  }, [tableLoading, fetchItems.isFetching]);

  // Handle selected rows change.
  const handleSelectedRowsChange = useCallback((accounts) => {
    setSelectedRows(accounts);
  }, [setSelectedRows]);
  
  return (
    <DashboardInsider
      isLoading={fetchHook.isFetching}
      name={'items-list'}>

      <ItemsActionsBar
        onFilterChanged={handleFilterChanged}
        selectedRows={selectedRows}
        views={itemsViews} />

      <DashboardPageContent>
        <Switch>
          <Route
            exact={true}
            path={[
              '/dashboard/items/:custom_view_id/custom_view',
              '/dashboard/items'
            ]}>
            <ItemsViewsTabs
              itemsViews={itemsViews}
              onViewChanged={handleCustomViewChanged} />

            <ItemsDataTable
              loading={tableLoading}
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
  withItems,
  withResourceActions,
  withDashboardActions,
  withItemsActions,
  withViewsActions,
)(ItemsList);
