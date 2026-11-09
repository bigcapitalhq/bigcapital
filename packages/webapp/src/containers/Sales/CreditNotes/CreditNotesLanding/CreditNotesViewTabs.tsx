import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import React from 'react';
import { useCreditNoteListContext } from './CreditNotesListProvider';
import { withCreditNotes } from './withCreditNotes';
import { withCreditNotesActions } from './withCreditNotesActions';
import type { WithCreditNotesProps } from './withCreditNotes';
import type { WithCreditNotesActionsProps } from './withCreditNotesActions';
import { DashboardViewsTabs } from '@/components';
import { transfromViewsToTabs } from '@/utils';

interface CreditNotesViewTabsProps extends WithCreditNotesActionsProps {
  creditNoteCurrentView: string;
}

function CreditNotesViewTabsInner({
  creditNoteCurrentView,
  setCreditNotesTableState,
}: CreditNotesViewTabsProps) {
  const { CreditNotesView } = useCreditNoteListContext();

  const tabs = transfromViewsToTabs(CreditNotesView);

  const handleTabsChange = (viewSlug: string) => {
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

export const CreditNotesViewTabs = FF.pipe(
  CreditNotesViewTabsInner,
  withCreditNotes(({ creditNoteTableState }: WithCreditNotesProps) => ({
    creditNoteCurrentView: creditNoteTableState.viewSlug,
  })),
  withCreditNotesActions,
);
