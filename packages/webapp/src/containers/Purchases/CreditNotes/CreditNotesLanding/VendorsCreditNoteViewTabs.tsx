// @ts-nocheck
import React from 'react';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';

import { DashboardViewsTabs } from '@/components';

import withVendorsCreditNotes from './withVendorsCreditNotes';
import withVendorsCreditNotesActions from './withVendorsCreditNotesActions';

import { compose, transformViewsToTabs } from '@/utils';
import { useVendorsCreditNoteListContext } from './VendorsCreditNoteListProvider';

/**
 * Vendors Credit note views tabs.
 */
function VendorsCreditNoteViewTabs({
  // #withVendorsCreditNotes
  vendorCreditCurrentView,

  // #withVendorsCreditNotesActions
  setVendorsCreditNoteTableState,
}) {
  // vendor credit list context.
  const { VendorCreditsViews } = useVendorsCreditNoteListContext();

  // Handle tab change.
  const handleTabsChange = (viewSlug) => {
    setVendorsCreditNoteTableState({ viewSlug: viewSlug || null });
  };

  const tabs = transformViewsToTabs(VendorCreditsViews);
  return (
    <Navbar className={'navbar--dashboard-views'}>
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          currentViewSlug={vendorCreditCurrentView}
          resourceName={'vendor_credits'}
          tabs={tabs}
          onChange={handleTabsChange}
        />
      </NavbarGroup>
    </Navbar>
  );
}

export default compose(
  withVendorsCreditNotesActions,
  withVendorsCreditNotes(({ vendorsCreditNoteTableState }) => ({
    vendorCreditCurrentView: vendorsCreditNoteTableState.viewSlug,
  })),
)(VendorsCreditNoteViewTabs);
