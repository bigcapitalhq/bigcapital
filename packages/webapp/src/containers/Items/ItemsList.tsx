import React from 'react';
import { compose } from '@/utils';

import '@/style/pages/Items/List.scss';

import { ItemsActionsBar } from './ItemsActionsBar';
import { ItemsDataTable } from './ItemsDataTable';
import { ItemsListDialogs } from './ItemsListDialogs';
import { ItemsListDrawers } from './ItemsListDrawers';
import { ItemsListProvider } from './ItemsListProvider';
import { withItems } from './withItems';
import { withItemsActions } from './withItemsActions';
import type { WithItemsProps } from './withItems';
import type { WithItemsActionsProps } from './withItemsActions';
import { DashboardPageContent } from '@/components';

interface ItemsListInnerProps
  extends Pick<WithItemsProps, 'itemsTableState' | 'itemsTableStateChanged'>,
    WithItemsActionsProps {}

/**
 * Items list.
 */
function ItemsListInner({
  // #withItems
  itemsTableState,
  itemsTableStateChanged,

  // #withItemsActions
  resetItemsTableState,
  resetItemsSelectedRows,
}: ItemsListInnerProps) {
  // Resets items table query state and selected rows once the page unmount.
  React.useEffect(
    () => () => {
      resetItemsTableState();
      resetItemsSelectedRows();
    },
    [resetItemsSelectedRows, resetItemsTableState],
  );

  return (
    <ItemsListProvider
      tableState={itemsTableState}
      tableStateChanged={itemsTableStateChanged}
    >
      <ItemsActionsBar />
      <ItemsListDrawers />
      <ItemsListDialogs />

      <DashboardPageContent>
        <ItemsDataTable />
      </DashboardPageContent>
    </ItemsListProvider>
  );
}

export const ItemsList = compose(
  withItemsActions,
  withItems(({ itemsTableState, itemsTableStateChanged }) => ({
    itemsTableState,
    itemsTableStateChanged,
  })),
)(ItemsListInner);
