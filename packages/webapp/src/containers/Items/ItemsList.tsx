// @ts-nocheck
import React from 'react';

import '@/style/pages/Items/List.scss';

import { DashboardPageContent } from '@/components';
import { ItemsListProvider } from './ItemsListProvider';

import { ItemsActionsBar } from './ItemsActionsBar';
import { ItemsDataTable } from './ItemsDataTable';

import { withItems } from './withItems';
import { withItemsActions } from './withItemsActions';
import { flow } from 'fp-ts/function';

/**
 * Items list.
 */
function ItemsListInner({
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
        <ItemsDataTable />
      </DashboardPageContent>
    </ItemsListProvider>
  );
}

export const ItemsList = flow(
  withItems(({ itemsTableState, itemsTableStateChanged }) => ({
    itemsTableState,
    itemsTableStateChanged,
  })),
  withItemsActions,
)(ItemsListInner);
