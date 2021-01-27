import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { useQuery } from 'react-query';
import { FormattedMessage as T, useIntl } from 'react-intl';

import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { compose } from 'utils';

import ItemsViewPage from './ItemsViewPage';
import ItemsActionsBar from 'containers/Items/ItemsActionsBar';
import ItemsAlerts from './ItemsAlerts';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';

import withItems from 'containers/Items/withItems';
import withResourceActions from 'containers/Resources/withResourcesActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withItemsActions from 'containers/Items/withItemsActions';
import withViewsActions from 'containers/Views/withViewsActions';

import 'style/pages/Items/List.scss';

/**
 * Items list.
 */
function ItemsList({
  // #withDashboardActions
  changePageTitle,

  // #withResourceActions
  requestFetchResourceViews,
  requestFetchResourceFields,

  // #withItems
  itemsTableQuery,

  // #withItemsActions
  requestFetchItems,
  addItemsTableQueries,
}) {
  const { formatMessage } = useIntl();

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

  // Handle filter change to re-fetch the items.
  const handleFilterChanged = useCallback(
    (filterConditions) => {
      addItemsTableQueries({
        filter_roles: filterConditions || '',
      });
    },
    [addItemsTableQueries],
  );

  return (
    <DashboardInsider
      loading={fetchResourceViews.isFetching || fetchResourceFields.isFetching}
      name={'items-list'}
    >
      <ItemsActionsBar onFilterChanged={handleFilterChanged} />

      <DashboardPageContent>
        <ItemsViewPage />
      </DashboardPageContent>
      <ItemsAlerts />
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
