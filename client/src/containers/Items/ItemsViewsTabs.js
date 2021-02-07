import React from 'react';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { useParams } from 'react-router-dom';
import { compose } from 'utils';
import { DashboardViewsTabs } from 'components';
import { pick } from 'lodash';

import withItemsActions from 'containers/Items/withItemsActions';
import { useItemsListContext } from './ItemsListProvider';

/**
 * Items views tabs.
 */
function ItemsViewsTabs({
  // #withItemsActions
  addItemsTableQueries,
}) {
  const { custom_view_id: customViewId = null } = useParams();
  const { itemsViews } = useItemsListContext();

  const tabs = itemsViews.map((view) => ({
    ...pick(view, ['name', 'id']),
  }));

  const handleTabChange = (viewId) => {
    addItemsTableQueries({
      custom_view_id: viewId || null,
    });
  };

  return (
    <Navbar className="navbar--dashboard-views">
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          initialViewId={customViewId}
          resourceName={'items'}
          tabs={tabs}
          onChange={handleTabChange}
        />
      </NavbarGroup>
    </Navbar>
  );
}


export default compose(
  withItemsActions,
)(ItemsViewsTabs);
