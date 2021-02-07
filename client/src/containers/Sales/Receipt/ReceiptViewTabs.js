import React from 'react';
import { useHistory } from 'react-router';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { useParams } from 'react-router-dom';
import { pick } from 'lodash';

import { DashboardViewsTabs } from 'components';

import withReceiptActions from './withReceiptActions';

import { compose } from 'utils';
import { useReceiptsListContext } from './ReceiptsListProvider';

/**
 * Receipt views tabs.
 */
function ReceiptViewTabs({ addReceiptsTableQueries }) {
  const { custom_view_id: customViewId = null } = useParams();

  const { receiptsViews } = useReceiptsListContext();

  const tabs = receiptsViews.map((view) => ({
    ...pick(view, ['name', 'id']),
  }));

  const handleTabsChange = (viewId) => {
    addReceiptsTableQueries({
      custom_view_id: viewId || null,
    });
  };

  return (
    <Navbar className={'navbar--dashboard-views'}>
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          initialViewId={customViewId}
          tabs={tabs}
          resourceName={'receipts'}
          onChange={handleTabsChange}
        />
      </NavbarGroup>
    </Navbar>
  );
}

export default compose(withReceiptActions)(ReceiptViewTabs);
