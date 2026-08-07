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
import { DashboardPageContent } from '@/components';
import { transformTableStateToQuery, compose } from '@/utils';

interface WithCreditNotesActionsProps {
  resetCreditNotesTableState: () => void;
}

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
}: CreditNotesListProps) {
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
      <CreditNotesListDrawers />
      <CreditNotesListDialogs />

      <DashboardPageContent>
        <CreditNotesDataTable />
      </DashboardPageContent>
    </CreditNotesListProvider>
  );
}

export const CreditNotesList = compose(
  withCreditNotesActions,
  withCreditNotes(({ creditNoteTableState, creditNoteTableStateChanged }) => ({
    creditNoteTableState,
    creditNoteTableStateChanged,
  })),
)(CreditNotesListInner);
