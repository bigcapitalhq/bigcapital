import React from 'react';
import { compose } from '@/utils';

import '@/style/pages/Items/List.scss';

import { DashboardPageContent } from '@/components';

import ItemsActionsBar from './ItemsActionsBar';
import ItemsViewsTabs from './ItemsViewsTabs';
import ItemsDataTable from './ItemsDataTable';

import { ItemsListProvider } from './ItemsListProvider';

import withItems from './withItems';
import withItemsActions from './withItemsActions';

/**
 * Items list.
 */
function ItemsList({
  // #withItems
  itemsTableState,
  itemsTableStateChanged,

  // #withItemsActions
  resetItemsTableState,
}) {
  // Resets items table query state once the page unmount.
  React.useEffect(
    () => () => {
      resetItemsTableState();
    },
    [resetItemsTableState],
  );

  return (
    <ItemsListProvider
      tableState={itemsTableState}
      tableStateChanged={itemsTableStateChanged}
    >
      <ItemsActionsBar />

      <DashboardPageContent>
        <ItemsViewsTabs />
        <ItemsDataTable />
      </DashboardPageContent>

    </ItemsListProvider>
  );
}

export default compose(
  withItemsActions,
  withItems(({ itemsTableState, itemsTableStateChanged }) => ({
    itemsTableState,
    itemsTableStateChanged,
  })),
)(ItemsList);
