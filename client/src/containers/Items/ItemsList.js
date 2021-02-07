import React from 'react';
import { compose } from 'utils';

import 'style/pages/Items/List.scss';

import ItemsViewPage from './ItemsViewPage';
import ItemsActionsBar from './ItemsActionsBar';
import ItemsAlerts from './ItemsAlerts';

import { ItemsListProvider } from './ItemsListProvider';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';

import withItems from 'containers/Items/withItems';

/**
 * Items list.
 */
function ItemsList({
  // #withItems
  itemsTableQuery
}) {
  return (
    <ItemsListProvider query={itemsTableQuery}>
      <ItemsActionsBar />

      <DashboardPageContent>
        <ItemsViewPage />
      </DashboardPageContent>
      <ItemsAlerts />
    </ItemsListProvider>
  );
}

export default compose(
  withItems(({ itemsTableQuery }) => ({ itemsTableQuery })),
)(ItemsList);
