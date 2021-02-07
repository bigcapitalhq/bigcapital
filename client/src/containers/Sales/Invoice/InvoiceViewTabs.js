import React from 'react';
import { useHistory } from 'react-router';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { useParams } from 'react-router-dom';
import { pick } from 'lodash';

import { DashboardViewsTabs } from 'components';

import withInvoiceActions from './withInvoiceActions';

import { compose } from 'utils';
import { useInvoicesListContext } from './InvoicesListProvider';

/**
 * Invoices views tabs.
 */
function InvoiceViewTabs({
  // #withInvoiceActions
  addInvoiceTableQueries,
}) {
  const history = useHistory();
  const { custom_view_id: customViewId = null } = useParams();

  // Invoices list context.
  const { invoicesViews } = useInvoicesListContext();

  const tabs = invoicesViews.map((view) => ({
    ...pick(view, ['name', 'id']),
  }));

  // Handle tab change.
  const handleTabsChange = (viewId) => {    
    addInvoiceTableQueries({
      custom_view_id: customViewId || null,
    });
  };

  // Handle click a new view tab.
  const handleClickNewView = () => {
    history.push('/custom_views/invoices/new');
  };

  return (
    <Navbar className={'navbar--dashboard-views'}>
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          initialViewId={customViewId}
          resourceName={'invoices'}
          tabs={tabs}
          onNewViewTabClick={handleClickNewView}
          onChange={handleTabsChange}
        />
      </NavbarGroup>
    </Navbar>
  );
}

export default compose(
  withInvoiceActions,
)(InvoiceViewTabs);
