import React from 'react';
import { compose } from 'utils';

import 'style/pages/Items/List.scss';

import { DashboardContentTable, DashboardPageContent } from 'components';

import ItemsActionsBar from './ItemsActionsBar';
import ItemsAlerts from './ItemsAlerts';
import ItemsViewsTabs from './ItemsViewsTabs';
import ItemsDataTable from './ItemsDataTable';

import { ItemsListProvider } from './ItemsListProvider';
import withItems from './withItems';
import { transformTableStateToQuery } from 'utils';

/**
 * Items list.
 */
function ItemsList({
  // #withItems
  itemsTableState,
}) {
  return (
    <ItemsListProvider query={transformTableStateToQuery(itemsTableState)}>
      <ItemsActionsBar />

      <DashboardPageContent>
        <ItemsViewsTabs />

        <DashboardContentTable>
          <ItemsDataTable />
        </DashboardContentTable>
      </DashboardPageContent>

      <ItemsAlerts />
    </ItemsListProvider>
  );
}

export default compose(
  withItems(({ itemsTableState }) => ({ itemsTableState })),
)(ItemsList);
