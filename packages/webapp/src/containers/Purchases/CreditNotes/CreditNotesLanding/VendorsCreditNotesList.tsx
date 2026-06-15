// @ts-nocheck
import React from 'react';

import '@/style/pages/VendorsCreditNote/List.scss';

import { DashboardPageContent } from '@/components';
import { VendorsCreditNoteActionsBar } from './VendorsCreditNoteActionsBar';
import { VendorsCreditNoteDataTable } from './VendorsCreditNoteDataTable';

import { withVendorsCreditNotes } from './withVendorsCreditNotes';
import { withVendorsCreditNotesActions } from './withVendorsCreditNotesActions';

import { VendorsCreditNoteListProvider } from './VendorsCreditNoteListProvider';
import { transformTableStateToQuery } from '@/utils';
import { flow } from 'fp-ts/function';

function VendorsCreditNotesListInner({
  // #withVendorsCreditNotes
  vendorsCreditNoteTableState,
  vendorsCreditNoteTableStateChanged,

  // #withVendorsCreditNotesActions
  resetVendorsCreditNoteTableState,
}) {
  // Resets the credit note table state once the page unmount.
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
      <DashboardPageContent>
        <VendorsCreditNoteDataTable />
      </DashboardPageContent>
    </VendorsCreditNoteListProvider>
  );
}

export const VendorsCreditNotesList = flow(
  withVendorsCreditNotes(
    ({ vendorsCreditNoteTableState, vendorsCreditNoteTableStateChanged }) => ({
      vendorsCreditNoteTableState,
      vendorsCreditNoteTableStateChanged,
    }),
  ),
  withVendorsCreditNotesActions,
)(VendorsCreditNotesListInner);
