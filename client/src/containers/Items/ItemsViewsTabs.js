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
  addItemsTableQueries,

  // #withItems
  itemsTableQuery
}) {
  const { itemsViews } = useItemsListContext();

  // Mapped items views.
  const tabs = itemsViews.map((view) => ({
    ...pick(view, ['name', 'id']),
  }));

  // Handles the active tab change.
  const handleTabChange = (viewId) => {
    addItemsTableQueries({
      page: 1,
      customViewId: viewId || null,
    });
  };

  return (
    <Navbar className="navbar--dashboard-views">
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          currentViewId={itemsTableQuery.customViewId}
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
  withItems(({ itemsTableQuery }) => ({ itemsTableQuery })),
  withItemsActions,
)(ItemsViewsTabs);
