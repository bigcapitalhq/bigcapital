import * as FF from 'fp-ts/function';
import React from 'react';
import '@/style/pages/CreditNote/List.scss';
import { CreditNotesActionsBar } from './CreditNotesActionsBar';
import { CreditNotesDataTable } from './CreditNotesDataTable';
import { CreditNotesListDialogs } from './CreditNotesListDialogs';
import { CreditNotesListDrawers } from './CreditNotesListDrawers';
import { CreditNotesListProvider } from './CreditNotesListProvider';
import { withCreditNotes } from './withCreditNotes';
import { withCreditNotesActions } from './withCreditNotesActions';
import type { WithCreditNotesProps } from './withCreditNotes';
import type { WithCreditNotesActionsProps } from './withCreditNotesActions';
import { DashboardPageContent } from '@/components';
import { transformTableStateToQuery } from '@/utils';

interface CreditNotesListProps
  extends Pick<
      WithCreditNotesProps,
      'creditNoteTableState' | 'creditNoteTableStateChanged'
    >,
    WithCreditNotesActionsProps {}

function CreditNotesListInner({
  creditNoteTableState,
  creditNoteTableStateChanged,
  resetCreditNotesTableState,
  resetCreditNotesSelectedRows,
}: CreditNotesListProps) {
  React.useEffect(
    () => () => {
      resetCreditNotesTableState();
      resetCreditNotesSelectedRows();
    },
    [resetCreditNotesSelectedRows, resetCreditNotesTableState],
  );

  return (
    <CreditNotesListProvider
      query={transformTableStateToQuery(creditNoteTableState)}
      tableStateChanged={creditNoteTableStateChanged}
    >
      <CreditNotesActionsBar />
      <CreditNotesListDrawers />
      <CreditNotesListDialogs />

      <DashboardPageContent>
        <CreditNotesDataTable />
      </DashboardPageContent>
    </CreditNotesListProvider>
  );
}

export const CreditNotesList = FF.pipe(
  CreditNotesListInner,
  withCreditNotes(({ creditNoteTableState, creditNoteTableStateChanged }) => ({
    creditNoteTableState,
    creditNoteTableStateChanged,
  })),
  withCreditNotesActions,
);
