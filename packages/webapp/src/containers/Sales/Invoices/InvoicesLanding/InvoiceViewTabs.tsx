// @ts-nocheck
import React from 'react';
import { useHistory } from 'react-router';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';

import { DashboardViewsTabs } from '@/components';
import { compose, transformViewsToTabs } from '@/utils';
import { useInvoicesListContext } from './InvoicesListProvider';

import withInvoices from './withInvoices';
import withInvoiceActions from './withInvoiceActions';

/**
 * Invoices views tabs.
 */
function InvoiceViewTabs({
  // #withInvoiceActions
  setInvoicesTableState,

  // #withInvoices
  invoicesCurrentView,
}) {
  const history = useHistory();

  // Invoices list context.
  const { invoicesViews } = useInvoicesListContext();

  const tabs = transformViewsToTabs(invoicesViews);

  // Handle tab change.
  const handleTabsChange = (viewSlug) => {
    setInvoicesTableState({ viewSlug });
  };
  // Handle click a new view tab.
  const handleClickNewView = () => {
    history.push('/custom_views/invoices/new');
  };

  return (
    <Navbar className={'navbar--dashboard-views'}>
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          currentViewSlug={invoicesCurrentView}
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
  withInvoices(({ invoicesTableState }) => ({
    invoicesCurrentView: invoicesTableState.viewSlug,
  })),
)(InvoiceViewTabs);
