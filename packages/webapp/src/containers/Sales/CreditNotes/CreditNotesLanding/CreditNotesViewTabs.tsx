import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import React from 'react';
import { useCreditNoteListContext } from './CreditNotesListProvider';
import { withCreditNotes } from './withCreditNotes';
import { withCreditNotesActions } from './withCreditNotesActions';
import type { WithCreditNotesProps } from './withCreditNotes';
import { DashboardViewsTabs } from '@/components';
import { compose, transfromViewsToTabs } from '@/utils';

interface WithCreditNotesActionsProps {
  setCreditNotesTableState: (state: Record<string, any>) => void;
}

interface CreditNotesViewTabsProps {
  creditNoteCurrentView: string;
  setCreditNotesTableState: WithCreditNotesActionsProps['setCreditNotesTableState'];
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

export const CreditNotesViewTabs = compose(
  withCreditNotesActions,
  withCreditNotes(({ creditNoteTableState }: WithCreditNotesProps) => ({
    creditNoteCurrentView: creditNoteTableState.viewSlug,
  })),
)(CreditNotesViewTabsInner);
