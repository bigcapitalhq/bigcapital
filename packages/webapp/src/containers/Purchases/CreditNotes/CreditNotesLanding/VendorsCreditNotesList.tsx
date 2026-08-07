import React from 'react';

import '@/style/pages/VendorsCreditNote/List.scss';
import { VendorsCreditNoteActionsBar } from './VendorsCreditNoteActionsBar';
import { VendorsCreditNoteDataTable } from './VendorsCreditNoteDataTable';
import { VendorsCreditNoteListProvider } from './VendorsCreditNoteListProvider';
import { VendorsCreditNotesListDialogs } from './VendorsCreditNotesListDialogs';
import { VendorsCreditNotesListDrawers } from './VendorsCreditNotesListDrawers';
import { withVendorsCreditNotes } from './withVendorsCreditNotes';
import { withVendorsCreditNotesActions } from './withVendorsCreditNotesActions';
import type { WithVendorsCreditNotesProps } from './withVendorsCreditNotes';
import { DashboardPageContent } from '@/components';
import { transformTableStateToQuery, compose } from '@/utils';

interface WithVendorsCreditNotesActionsProps {
  resetVendorsCreditNoteTableState: () => void;
}

interface VendorsCreditNotesListProps
  extends Pick<
      WithVendorsCreditNotesProps,
      'vendorsCreditNoteTableState' | 'vendorsCreditNoteTableStateChanged'
    >,
    WithVendorsCreditNotesActionsProps {}

function VendorsCreditNotesListInner({
  vendorsCreditNoteTableState,
  vendorsCreditNoteTableStateChanged,
  resetVendorsCreditNoteTableState,
}: VendorsCreditNotesListProps) {
  React.useEffect(
    () => () => {
      resetVendorsCreditNoteTableState();
    },
    [resetVendorsCreditNoteTableState],
  );

  return (
    <VendorsCreditNoteListProvider
      query={transformTableStateToQuery(vendorsCreditNoteTableState)}
      tableStateChanged={vendorsCreditNoteTableStateChanged}
    >
      <VendorsCreditNoteActionsBar />
      <VendorsCreditNotesListDrawers />
      <VendorsCreditNotesListDialogs />

      <DashboardPageContent>
        <VendorsCreditNoteDataTable />
      </DashboardPageContent>
    </VendorsCreditNoteListProvider>
  );
}

export const VendorsCreditNotesList = compose(
  withVendorsCreditNotesActions,
  withVendorsCreditNotes(
    ({ vendorsCreditNoteTableState, vendorsCreditNoteTableStateChanged }) => ({
      vendorsCreditNoteTableState,
      vendorsCreditNoteTableStateChanged,
    }),
  ),
)(VendorsCreditNotesListInner);
