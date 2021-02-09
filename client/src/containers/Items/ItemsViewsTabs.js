import React from 'react';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { compose } from 'utils';
import { DashboardViewsTabs } from 'components';
import { pick } from 'lodash';
import { withRouter } from 'react-router-dom';

import withItemsActions from 'containers/Items/withItemsActions';
import withItems from 'containers/Items/withItems';

import { useItemsListContext } from './ItemsListProvider';

/**
 * Items views tabs.
 */
function ItemsViewsTabs({
  // #withItemsActions
  setItemsTableState,

  // #withItems
  itemsCustomViewId
}) {
  const { itemsViews } = useItemsListContext();

  // Mapped items views.
  const tabs = itemsViews.map((view) => ({
    ...pick(view, ['name', 'id']),
  }));

  // Handles the active tab change.
  const handleTabChange = (viewId) => {
    setItemsTableState({
      pageIndex: 0,
      customViewId: viewId || null,
    });
  };

  return (
    <Navbar className="navbar--dashboard-views">
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          currentViewId={itemsCustomViewId}
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
    itemsCustomViewId: itemsTableState?.customViewId
  })),
  withItemsActions,
)(ItemsViewsTabs);
