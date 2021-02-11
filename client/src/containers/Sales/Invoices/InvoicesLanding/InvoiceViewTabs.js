import React from 'react';
import { useHistory } from 'react-router';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { pick } from 'lodash';

import { DashboardViewsTabs } from 'components';

import withInvoices from './withInvoices';
import withInvoiceActions from './withInvoiceActions';

import { compose } from 'utils';
import { useInvoicesListContext } from './InvoicesListProvider';

/**
 * Invoices views tabs.
 */
function InvoiceViewTabs({
  // #withInvoiceActions
  setInvoicesTableState,

  // #withInvoices
  invoicesTableState
}) {
  const history = useHistory();

  // Invoices list context.
  const { invoicesViews } = useInvoicesListContext();

  const tabs = invoicesViews.map((view) => ({
    ...pick(view, ['name', 'id']),
  }));

  // Handle tab change.
  const handleTabsChange = (customView) => {    
    setInvoicesTableState({
      customViewId: customView.id || null,
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
          customViewId={invoicesTableState.customViewId}
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
  withInvoices(({ invoicesTableState }) => ({ invoicesTableState })),
)(InvoiceViewTabs);
