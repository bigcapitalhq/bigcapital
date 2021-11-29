import React from 'react';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';

import { DashboardViewsTabs } from 'components';

import withVendorsCreditNotes from './withVendorsCreditNotes';
import withVendorsCreditNotesActions from './withVendorsCreditNotesActions';

import { compose, transfromViewsToTabs } from 'utils';
import { useVendorsCreditNoteListContext } from './VendorsCreditNoteListProvider';

/**
 * Vendors Credit note views tabs.
 */
function VendorsCreditNoteViewTabs({
  // #withVendorsCreditNotes
  creditNoteCurrentView,

  // #withVendorsCreditNotesActions
  setVendorsCreditNoteTableState,
}) {
  // Credit note list context.

  // Handle click a new view tab.
  const handleClickNewView = () => {};

  // const tabs = transfromViewsToTabs(creditNoteCurrentView);

  // Handle tab change.
  const handleTabsChange = (viewSlug) => {
    setVendorsCreditNoteTableState({ viewSlug });
  };

  return (
    <Navbar className={'navbar--dashboard-views'}>
      <NavbarGroup align={Alignment.LEFT}></NavbarGroup>
    </Navbar>
  );
}

export default compose(
  withVendorsCreditNotesActions,
  withVendorsCreditNotes(({ vendorsCreditNoteTableState }) => ({
    creditNoteCurrentView: vendorsCreditNoteTableState.viewSlug,
  })),
)(VendorsCreditNoteViewTabs);
