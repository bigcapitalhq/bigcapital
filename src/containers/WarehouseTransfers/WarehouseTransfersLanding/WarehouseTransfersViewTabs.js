import React from 'react';
import { useHistory } from 'react-router';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { FormattedMessage as T } from 'components';

import { DashboardViewsTabs } from 'components';

import { useWarehouseTranfersListContext } from './WarehouseTransfersListProvider';

import { compose } from 'utils';

/**
 * Warehouse transfer view tabs.
 */
function WarehouseTransfersViewTabs() {
  // Handles click a new view tab.
  const handleClickNewView = () => {};

  // Handles the active tab chaing.
  const handleTabsChange = (customView) => {};

  return (
    <Navbar className={'navbar--dashboard-views'}>
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          customViewId={null}
          tabs={[]}
          defaultTabText={<T id={'all'} />}
          onNewViewTabClick={handleClickNewView}
          onChange={handleTabsChange}
        />
      </NavbarGroup>
    </Navbar>
  );
}

export default WarehouseTransfersViewTabs;
