import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useInvoicesListContext } from './InvoicesListProvider';
import { withInvoiceActions } from './withInvoiceActions';
import { withInvoices } from './withInvoices';
import type { WithInvoiceActionsProps } from './withInvoiceActions';
import type { WithInvoicesProps } from './withInvoices';
import { DashboardViewsTabs } from '@/components';
import { transfromViewsToTabs } from '@/utils';

interface InvoiceViewTabsProps extends WithInvoiceActionsProps {
  invoicesCurrentView: string;
}

function InvoiceViewTabsInner({
  setInvoicesTableState,
  invoicesCurrentView,
}: InvoiceViewTabsProps) {
  const history = useHistory();

  const { invoicesViews } = useInvoicesListContext();

  const tabs = transfromViewsToTabs(invoicesViews);

  const handleTabsChange = (viewSlug: string) => {
    setInvoicesTableState({ viewSlug });
  };
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

export const InvoiceViewTabs = FF.pipe(
  InvoiceViewTabsInner,
  withInvoices(({ invoicesTableState }: WithInvoicesProps) => ({
    invoicesCurrentView: invoicesTableState.viewSlug,
  })),
  withInvoiceActions,
);
