// @ts-nocheck
import React from 'react';

import '@/style/pages/CreditNote/List.scss';

import { DashboardPageContent } from '@/components';
import { CreditNotesActionsBar } from './CreditNotesActionsBar';
import { CreditNotesDataTable } from './CreditNotesDataTable';

import { withCreditNotes } from './withCreditNotes';
import { withCreditNotesActions } from './withCreditNotesActions';

import { CreditNotesListProvider } from './CreditNotesListProvider';
import { transformTableStateToQuery } from '@/utils';
import { flow } from 'fp-ts/function';

function CreditNotesListInner({
  // #withCreditNotes
  creditNoteTableState,
  creditNoteTableStateChanged,

  // #withCreditNotesActions
  resetCreditNotesTableState,
}) {
  // Resets the credit note table state once the page unmount.
  React.useEffect(
    () => () => {
      resetCreditNotesTableState();
    },
    [resetCreditNotesTableState],
  );

  return (
    <CreditNotesListProvider
      query={transformTableStateToQuery(creditNoteTableState)}
      tableStateChanged={creditNoteTableStateChanged}
    >
      <CreditNotesActionsBar />

      <DashboardPageContent>
        <CreditNotesDataTable />
      </DashboardPageContent>
    </CreditNotesListProvider>
  );
}

export const CreditNotesList = flow(
  withCreditNotes(({ creditNoteTableState, creditNoteTableStateChanged }) => ({
    creditNoteTableState,
    creditNoteTableStateChanged,
  })),
  withCreditNotesActions,
)(CreditNotesListInner);
