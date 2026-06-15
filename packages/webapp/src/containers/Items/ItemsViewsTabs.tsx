// @ts-nocheck
import React from 'react';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { DashboardViewsTabs } from '@/components';
import { withRouter } from 'react-router-dom';

import { withItems } from './withItems';
import { withItemsActions } from './withItemsActions';

import { useItemsListContext } from './ItemsListProvider';
import { transfromViewsToTabs } from '@/utils';
import { flow } from 'fp-ts/function';

/**
 * Items views tabs.
 */
function ItemsViewsTabsInner({
  // #withItemsActions
  setItemsTableState,

  // #withItems
  itemsCurrentView,
}) {
  const { itemsViews } = useItemsListContext();

  // Mapped items views.
  const tabs = transfromViewsToTabs(itemsViews);

  // Handles the active tab change.
  const handleTabChange = (viewSlug) => {
    setItemsTableState({ viewSlug });
  };

  return (
    <Navbar className="navbar--dashboard-views">
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          currentViewSlug={itemsCurrentView}
          resourceName={'items'}
          tabs={tabs}
          onChange={handleTabChange}
        />
      </NavbarGroup>
    </Navbar>
  );
}

export const ItemsViewsTabs = flow(
  withItemsActions,
  withItems(({ itemsTableState }) => ({
    itemsCurrentView: itemsTableState?.viewSlug,
  })),
  withRouter,
)(ItemsViewsTabsInner);
