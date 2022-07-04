import React from 'react';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { DashboardViewsTabs } from '@/components';
import { withRouter } from 'react-router-dom';

import withItemsActions from 'containers/Items/withItemsActions';
import withItems from 'containers/Items/withItems';

import { useItemsListContext } from './ItemsListProvider';
import { compose, transfromViewsToTabs } from 'utils';

/**
 * Items views tabs.
 */
function ItemsViewsTabs({
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

export default compose(
  withRouter,
  withItems(({ itemsTableState }) => ({
    itemsCurrentView: itemsTableState?.viewSlug,
  })),
  withItemsActions,
)(ItemsViewsTabs);
