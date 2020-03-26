import React, { useEffect, useState } from 'react';
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
import DashboardViewsTabs from 'components/Accounts/AccountsViewsTabs';
import AppToaster from 'components/AppToaster';

function ItemsList({
  changePageTitle,
  fetchResourceViews,
  fetchResourceFields,
  views,
  requestDeleteItem,
}) {
  const [filterConditions, setFilterConditions] = useState([]);
  const [deleteItem, setDeleteItem] = useState(false);

  useEffect(() => {
    changePageTitle('Items List');
  }, []);

  const fetchHook = useAsync(async () => {
    await Promise.all([
      fetchResourceViews('items'),
      fetchResourceFields('items'),
    ])
  });
  const handleDeleteItem = (item) => { setDeleteItem(item); };
  const handleEditItem = () => {};
  const handleCancelDeleteItem = () => { setDeleteItem(false) };
  const handleConfirmDeleteItem = () => {
    requestDeleteItem(deleteItem.id).then(() => {
      AppToaster.show({ message: 'the_item_has_been_deleted' });
      setDeleteItem(false);
    });
  };

  const handleFilterChange = (filter) => { setFilterConditions(filter); };
  
  return (
    <DashboardInsider isLoading={fetchHook.pending} name={'items-list'}>
      <ItemsActionsBar views={views} onFilterChange={handleFilterChange} />

      <DashboardPageContent>
        <Switch>
          <Route>
            <DashboardViewsTabs resourceName={'items'} />

            <ItemsDataTable
              filterConditions={filterConditions}
              onDeleteItem={handleDeleteItem}
              onEditItem={handleEditItem} />

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
