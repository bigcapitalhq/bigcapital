import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { Intent, Alert } from '@blueprintjs/core';
import { useQuery, queryCache } from 'react-query';
import {
  FormattedMessage as T,
  FormattedHTMLMessage,
  useIntl,
} from 'react-intl';

import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { compose } from 'utils';

import ItemsViewsTabs from 'containers/Items/ItemsViewsTabs';
import ItemsDataTable from './ItemsDataTable';
import ItemsActionsBar from 'containers/Items/ItemsActionsBar';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import AppToaster from 'components/AppToaster';

import withItems from 'containers/Items/withItems';
import withResourceActions from 'containers/Resources/withResourcesActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withItemsActions from 'containers/Items/withItemsActions';
import withViewsActions from 'containers/Views/withViewsActions';

function ItemsList({
  // #withDashboardActions
  changePageTitle,

  // #withResourceActions
  requestFetchResourceViews,
  requestFetchResourceFields,

  // #withItems
  itemsTableQuery,

  // #withItemsActions
  requestDeleteItem,
  requestFetchItems,
  requestInactiveItem,
  requestActivateItem,
  addItemsTableQueries,
  requestDeleteBulkItems,
}) {
  const [deleteItem, setDeleteItem] = useState(false);
  const [inactiveItem, setInactiveItem] = useState(false);
  const [activateItem, setActivateItem] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [bulkDelete, setBulkDelete] = useState(false);

  const { formatMessage } = useIntl();
  const history = useHistory();

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'items_list' }));
  }, [changePageTitle, formatMessage]);

  // Handle fetching the resource views.
  const fetchResourceViews = useQuery(
    ['resource-views', 'items'],
    (key, resourceName) => requestFetchResourceViews(resourceName),
  );

  // Handle fetching the resource fields.
  const fetchResourceFields = useQuery(
    ['resource-fields', 'items'],
    (key, resourceName) => requestFetchResourceFields(resourceName),
  );

  // Handle fetching the items table based on the given query.
  const fetchItems = useQuery(['items-table', itemsTableQuery], (key, _query) =>
    requestFetchItems({ ..._query }),
  );

  // Handle click delete item.
  const handleDeleteItem = useCallback(
    (item) => {
      setDeleteItem(item);
    },
    [setDeleteItem],
  );

  const handleEditItem = useCallback(
    (item) => {
      history.push(`/items/${item.id}/edit`);
    },
    [history],
  );

  // Handle cancel delete the item.
  const handleCancelDeleteItem = useCallback(() => {
    setDeleteItem(false);
  }, [setDeleteItem]);

  // handle confirm delete item.
  const handleConfirmDeleteItem = useCallback(() => {
    requestDeleteItem(deleteItem.id)
      .then(() => {
        AppToaster.show({
          message: formatMessage({
            id: 'the_item_has_been_successfully_deleted',
          }),
          intent: Intent.SUCCESS,
        });
        setDeleteItem(false);
      })
      .catch(({ errors }) => {
        if (
          errors.find(
            (error) => error.type === 'ITEM_HAS_ASSOCIATED_TRANSACTINS',
          )
        ) {
          AppToaster.show({
            message: formatMessage({
              id: 'the_item_has_associated_transactions',
            }),
            intent: Intent.DANGER,
          });
        }
        setDeleteItem(false);
      });
  }, [requestDeleteItem, deleteItem, formatMessage]);

  const handleFetchData = useCallback(({ pageIndex, pageSize, sortBy }) => {}, [
    addItemsTableQueries,
  ]);

  // Handle filter change to re-fetch the items.
  const handleFilterChanged = useCallback(
    (filterConditions) => {
      addItemsTableQueries({
        filter_roles: filterConditions || '',
      });
    },
    [addItemsTableQueries],
  );

  // Handle selected rows change.
  const handleSelectedRowsChange = useCallback(
    (accounts) => {
      setSelectedRows(accounts);
    },
    [setSelectedRows],
  );

  // Calculates the data table selected rows count.
  const selectedRowsCount = useMemo(() => Object.values(selectedRows).length, [
    selectedRows,
  ]);

  // Handle items bulk delete button click.,

  const handleBulkDelete = useCallback(
    (itemsIds) => {
      setBulkDelete(itemsIds);
    },
    [setBulkDelete],
  );

  // Handle confirm items bulk delete.
  const handleConfirmBulkDelete = useCallback(() => {
    requestDeleteBulkItems(bulkDelete)
      .then(() => {
        setBulkDelete(false);
        AppToaster.show({
          message: formatMessage({
            id: 'the_items_has_been_successfully_deleted',
          }),
          intent: Intent.SUCCESS,
        });
      })
      .catch((errors) => {
        setBulkDelete(false);
      });
  }, [requestDeleteBulkItems, bulkDelete, formatMessage]);

  // Handle cancel accounts bulk delete.
  const handleCancelBulkDelete = useCallback(() => {
    setBulkDelete(false);
  }, []);

  // Handle cancel/confirm item inactive.
  const handleInactiveItem = useCallback((item) => {
    setInactiveItem(item);
  }, []);

  // Handle cancel inactive item alert.
  const handleCancelInactiveItem = useCallback(() => {
    setInactiveItem(false);
  }, []);

  // Handle confirm item Inactive.
  const handleConfirmItemInactive = useCallback(() => {
    requestInactiveItem(inactiveItem.id)
      .then(() => {
        setInactiveItem(false);
        AppToaster.show({
          message: formatMessage({
            id: 'the_item_has_been_successfully_inactivated',
          }),
          intent: Intent.SUCCESS,
        });
        queryCache.invalidateQueries('items-table');
      })
      .catch((error) => {
        setInactiveItem(false);
      });
  }, [inactiveItem, requestInactiveItem, formatMessage]);

  // Handle activate item click.
  const handleActivateItem = useCallback((item) => {
    setActivateItem(item);
  });

  // Handle activate item alert cancel.
  const handleCancelActivateItem = useCallback(() => {
    setActivateItem(false);
  });

  // Handle activate item confirm.
  const handleConfirmItemActivate = useCallback(() => {
    requestActivateItem(activateItem.id)
      .then(() => {
        setActivateItem(false);
        AppToaster.show({
          message: formatMessage({
            id: 'the_item_has_been_successfully_activated',
          }),
          intent: Intent.SUCCESS,
        });
        queryCache.invalidateQueries('items-table');
      })
      .catch((error) => {
        setActivateItem(false);
      });
  }, [activateItem, requestActivateItem, formatMessage]);

  return (
    <DashboardInsider
      loading={fetchResourceViews.isFetching || fetchResourceFields.isFetching}
      name={'items-list'}
    >
      <ItemsActionsBar
        selectedRows={selectedRows}
        onFilterChanged={handleFilterChanged}
        onBulkDelete={handleBulkDelete}
      />

      <DashboardPageContent>
        <Switch>
          <Route
            exact={true}
            path={['/items/:custom_view_id/custom_view', '/items']}
          >
            <ItemsViewsTabs />

            <ItemsDataTable
              onDeleteItem={handleDeleteItem}
              onEditItem={handleEditItem}
              onInactiveItem={handleInactiveItem}
              onActivateItem={handleActivateItem}
              onSelectedRowsChange={handleSelectedRowsChange}
            />
            <Alert
              cancelButtonText={<T id={'cancel'} />}
              confirmButtonText={<T id={'delete'} />}
              icon="trash"
              intent={Intent.DANGER}
              isOpen={deleteItem}
              onCancel={handleCancelDeleteItem}
              onConfirm={handleConfirmDeleteItem}
            >
              <p>
                <FormattedHTMLMessage
                  id={'once_delete_this_item_you_will_able_to_restore_it'}
                />
              </p>
            </Alert>

            <Alert
              cancelButtonText={<T id={'cancel'} />}
              confirmButtonText={`${formatMessage({
                id: 'delete',
              })} (${selectedRowsCount})`}
              icon="trash"
              intent={Intent.DANGER}
              isOpen={bulkDelete}
              onCancel={handleCancelBulkDelete}
              onConfirm={handleConfirmBulkDelete}
            >
              <p>
                <T
                  id={'once_delete_these_items_you_will_not_able_restore_them'}
                />
              </p>
            </Alert>
            <Alert
              cancelButtonText={<T id={'cancel'} />}
              confirmButtonText={<T id={'inactivate'} />}
              intent={Intent.WARNING}
              isOpen={inactiveItem}
              onCancel={handleCancelInactiveItem}
              onConfirm={handleConfirmItemInactive}
            >
              <p>
                <T id={'are_sure_to_inactive_this_item'} />
              </p>
            </Alert>
            <Alert
              cancelButtonText={<T id={'cancel'} />}
              confirmButtonText={<T id={'activate'} />}
              intent={Intent.WARNING}
              isOpen={activateItem}
              onCancel={handleCancelActivateItem}
              onConfirm={handleConfirmItemActivate}
            >
              <p>
                <T id={'are_sure_to_activate_this_item'} />
              </p>
            </Alert>
          </Route>
        </Switch>
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export default compose(
  withResourceActions,
  withDashboardActions,
  withItemsActions,
  withViewsActions,
  withItems(({ itemsTableQuery }) => ({
    itemsTableQuery,
  })),
)(ItemsList);
