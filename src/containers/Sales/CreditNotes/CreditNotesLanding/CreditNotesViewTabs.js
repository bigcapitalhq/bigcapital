import React from 'react';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';

import { DashboardViewsTabs } from 'components';

import withCreditNotes from './withCreditNotes';
import withCreditNotesActions from './withCreditNotesActions';

import { compose, transfromViewsToTabs } from 'utils';
import { useCreditNoteListContext } from './CreditNotesListProvider';

/**
 * Credit Note views tabs.
 */
function CreditNotesViewTabs({
  // #withCreditNotes
  creditNoteCurrentView,

  // #withCreditNotesActions
  setCreditNotesTableState,
}) {
  // Credit note list context.

  // Handle click a new view tab.
  const handleClickNewView = () => {};

  // const tabs = transfromViewsToTabs(creditNoteCurrentView);

  // Handle tab change.
  const handleTabsChange = (viewSlug) => {
    setCreditNotesTableState({ viewSlug });
  };

  return (
    <Navbar className={'navbar--dashboard-views'}>
      <NavbarGroup align={Alignment.LEFT}></NavbarGroup>
    </Navbar>
  );
}

export default compose(
  withCreditNotesActions,
  withCreditNotes(({ creditNoteTableState }) => ({
    creditNoteCurrentView: creditNoteTableState.viewSlug,
  })),
)(CreditNotesViewTabs);
