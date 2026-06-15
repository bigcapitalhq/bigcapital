// @ts-nocheck
import React from 'react';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';

import { DashboardViewsTabs } from '@/components';
import { transfromViewsToTabs } from '@/utils';
import { useCreditNoteListContext } from './CreditNotesListProvider';

import { withCreditNotes } from './withCreditNotes';
import { withCreditNotesActions } from './withCreditNotesActions';
import { flow } from 'fp-ts/function';

/**
 * Credit Note views tabs.
 */
function CreditNotesViewTabsInner({
  // #withCreditNotes
  creditNoteCurrentView,

  // #withCreditNotesActions
  setCreditNotesTableState,
}) {
  // Credit note list context.
  const { CreditNotesView } = useCreditNoteListContext();

  const tabs = transfromViewsToTabs(CreditNotesView);

  // Handle tab change.
  const handleTabsChange = (viewSlug) => {
    setCreditNotesTableState({ viewSlug });
  };

  return (
    <Navbar className={'navbar--dashboard-views'}>
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          currentViewSlug={creditNoteCurrentView}
          resourceName={'credit_notes'}
          tabs={tabs}
          onChange={handleTabsChange}
        />
      </NavbarGroup>
    </Navbar>
  );
}

export const CreditNotesViewTabs = flow(
  withCreditNotes(({ creditNoteTableState }) => ({
    creditNoteCurrentView: creditNoteTableState.viewSlug,
  })),
  withCreditNotesActions,
)(CreditNotesViewTabsInner);
