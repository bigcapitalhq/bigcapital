import React, { useEffect, useCallback, useState,useMemo } from 'react';
import {
  Route,
  Switch,
  useHistory
} from 'react-router-dom';
import {
  Intent,
  Alert,
} from '@blueprintjs/core';
import { useQuery } from 'react-query';
import { FormattedMessage as T, FormattedHTMLMessage, useIntl } from 'react-intl';

import DashboardInsider from 'components/Dashboard/DashboardInsider';
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
  itemsTableQuery,

  // #withItemsActions
  requestDeleteItem,
  requestFetchItems,
  addItemsTableQueries,
  requestDeleteBulkItems,
}) {
  const [deleteItem, setDeleteItem] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [bulkDelete, setBulkDelete] = useState(false);

  const { formatMessage } = useIntl();

  const history = useHistory();

  useEffect(() => {
    changePageTitle(formatMessage({id:'items_list'}));
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

  const handleEditItem = useCallback(
    (item) => {
      history.push(`/items/${item.id}/edit`);
    },
    [history]
  );

 

  // Handle cancel delete the item.
  const handleCancelDeleteItem = useCallback(() => {
    setDeleteItem(false);
  }, [setDeleteItem]);

  // handle confirm delete item.
  const handleConfirmDeleteItem = useCallback(() => {
    requestDeleteItem(deleteItem.id).then(() => {
      AppToaster.show({
        message: formatMessage({
          id: 'the_item_has_been_successfully_deleted',
        }),
        intent: Intent.SUCCESS,
      });
      setDeleteItem(false);
    });
  }, [requestDeleteItem, deleteItem,formatMessage]);

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
 
   // Calculates the data table selected rows count.
   const selectedRowsCount = useMemo(() => Object.values(selectedRows).length, [selectedRows]);

 

  // Handle items bulk delete button click.,

  const handleBulkDelete = useCallback((itemsIds) => {
    setBulkDelete(itemsIds);
  }, [setBulkDelete]);

   // Handle confirm items bulk delete.
   const handleConfirmBulkDelete = useCallback(() => {
    requestDeleteBulkItems(bulkDelete).then(() => {
      setBulkDelete(false);
      AppToaster.show({
        message: formatMessage({ id: 'the_items_has_been_successfully_deleted' }),
        intent: Intent.SUCCESS,
      });
    }).catch((errors) => {
      setBulkDelete(false);
    });
  }, [requestDeleteBulkItems, bulkDelete,formatMessage]);

    // Handle cancel accounts bulk delete.
    const handleCancelBulkDelete = useCallback(() => {
      setBulkDelete(false);
    }, []);


  return (
    <DashboardInsider
      isLoading={fetchHook.isFetching}
      name={'items-list'}>

      <ItemsActionsBar
        selectedRows={selectedRows} 
        onFilterChanged={handleFilterChanged}
        onBulkDelete={handleBulkDelete}/>

      <DashboardPageContent>
        <Switch>
          <Route
            exact={true}
            path={[
              '/items/:custom_view_id/custom_view',
              '/items'
            ]}>
            <ItemsViewsTabs
              onViewChanged={handleCustomViewChanged} /> 
 
            <ItemsDataTable
              loading={tableLoading}
              onDeleteItem={handleDeleteItem}
              onEditItem={handleEditItem}
              onFetchData={handleFetchData}
              onSelectedRowsChange={handleSelectedRowsChange} />

            <Alert
              cancelButtonText={<T id={'cancel'}/>}
              confirmButtonText={<T id={'delete'}/>}
              icon="trash"
              intent={Intent.DANGER}
              isOpen={deleteItem}
              onCancel={handleCancelDeleteItem}
              onConfirm={handleConfirmDeleteItem}>
              <p>
                <FormattedHTMLMessage
                  id={'once_delete_this_item_you_will_able_to_restore_it'} />
              </p>
            </Alert>

            <Alert
          cancelButtonText={<T id={'cancel'}/>}
          confirmButtonText={`${formatMessage({id:'delete'})} (${selectedRowsCount})`}
          icon="trash"
          intent={Intent.DANGER}
          isOpen={bulkDelete}
          onCancel={handleCancelBulkDelete}
          onConfirm={handleConfirmBulkDelete}
        >
          <p>
            <T id={'once_delete_these_items_you_will_not_able_restore_them'} />
          </p>
        </Alert>
          </Route>
        </Switch>
      </DashboardPageContent>
    </DashboardInsider>
  )
}

export default compose(
  withItems(({ itemsTableQuery }) => ({
    itemsTableQuery,
  })),
  withResourceActions,
  withDashboardActions,
  withItemsActions,
  withViewsActions,
)(ItemsList);
