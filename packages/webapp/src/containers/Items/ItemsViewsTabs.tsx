import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { useItemsListContext } from './ItemsListProvider';
import { withItems } from './withItems';
import { withItemsActions } from './withItemsActions';
import type { WithItemsProps } from './withItems';
import type { WithItemsActionsProps } from './withItemsActions';
import { DashboardViewsTabs } from '@/components';
import { compose, transfromViewsToTabs } from '@/utils';

interface ItemsViewsTabsInnerProps extends WithItemsActionsProps {
  itemsCurrentView: WithItemsProps['itemsTableState']['viewSlug'];
}

/**
 * Items views tabs.
 */
function ItemsViewsTabsInner({
  // #withItemsActions
  setItemsTableState,

  // #withItems
  itemsCurrentView,
}: ItemsViewsTabsInnerProps) {
  const { itemsViews } = useItemsListContext();

  // Mapped items views.
  const tabs = transfromViewsToTabs(itemsViews) as unknown[];

  // Handles the active tab change.
  const handleTabChange = (viewSlug: string) => {
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

export const ItemsViewsTabs = compose(
  withRouter,
  withItems(({ itemsTableState }) => ({
    itemsCurrentView: itemsTableState?.viewSlug,
  })),
  withItemsActions,
)(ItemsViewsTabsInner);
