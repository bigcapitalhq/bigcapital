import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import React from 'react';
import { useVendorsCreditNoteListContext } from './VendorsCreditNoteListProvider';
import { withVendorsCreditNotes } from './withVendorsCreditNotes';
import { withVendorsCreditNotesActions } from './withVendorsCreditNotesActions';
import type { WithVendorsCreditNotesProps } from './withVendorsCreditNotes';
import { DashboardViewsTabs } from '@/components';
import { transfromViewsToTabs } from '@/utils';

interface WithVendorsCreditNotesActionsProps {
  setVendorsCreditNoteTableState: (state: Record<string, any>) => void;
}

interface VendorsCreditNoteViewTabsProps {
  vendorCreditCurrentView: string;
  setVendorsCreditNoteTableState: WithVendorsCreditNotesActionsProps['setVendorsCreditNoteTableState'];
}

function VendorsCreditNoteViewTabsInner({
  vendorCreditCurrentView,
  setVendorsCreditNoteTableState,
}: VendorsCreditNoteViewTabsProps) {
  const { VendorCreditsViews } = useVendorsCreditNoteListContext();

  const handleTabsChange = (viewSlug: string | null) => {
    setVendorsCreditNoteTableState({ viewSlug: viewSlug || null });
  };

  const tabs = transfromViewsToTabs(VendorCreditsViews);
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

export const VendorsCreditNoteViewTabs = FF.pipe(
  VendorsCreditNoteViewTabsInner,
  withVendorsCreditNotes(
    ({ vendorsCreditNoteTableState }: WithVendorsCreditNotesProps) => ({
      vendorCreditCurrentView: vendorsCreditNoteTableState.viewSlug,
    }),
  ),
  withVendorsCreditNotesActions,
);
