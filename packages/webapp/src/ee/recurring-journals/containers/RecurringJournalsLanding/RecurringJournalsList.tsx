import * as FF from 'fp-ts/function';
import { useEffect } from 'react';
import { RecurringJournalsActionsBar } from './RecurringJournalsActionsBar';
import { RecurringJournalsDataTable } from './RecurringJournalsDataTable';
import { RecurringJournalsEmptyStatus } from './RecurringJournalsEmptyStatus';
import { RecurringJournalsListProvider } from './RecurringJournalsListProvider';
import { useRecurringJournalsListContext } from './RecurringJournalsListProvider';
import { withRecurringJournals } from './withRecurringJournals';
import { withRecurringJournalsActions } from './withRecurringJournalsActions';
import type { WithRecurringJournalsProps } from './withRecurringJournals';
import type { WithRecurringJournalsActionsProps } from './withRecurringJournalsActions';
import { DashboardPageContent } from '@/components';

interface RecurringJournalsListInnerProps
  extends Pick<
      WithRecurringJournalsProps,
      'recurringJournalsTableState' | 'recurringJournalsTableStateChanged'
    >,
    WithRecurringJournalsActionsProps {}

function RecurringJournalsListContent() {
  const { isEmptyStatus } = useRecurringJournalsListContext();

  if (isEmptyStatus) {
    return <RecurringJournalsEmptyStatus />;
  }
  return (
    <DashboardPageContent>
      <RecurringJournalsDataTable />
    </DashboardPageContent>
  );
}

function RecurringJournalsListInner({
  recurringJournalsTableState,
  recurringJournalsTableStateChanged,
  resetRecurringJournalsTableState,
  resetRecurringJournalsSelectedRows,
}: RecurringJournalsListInnerProps) {
  useEffect(
    () => () => {
      resetRecurringJournalsTableState();
      resetRecurringJournalsSelectedRows();
    },
    [resetRecurringJournalsTableState, resetRecurringJournalsSelectedRows],
  );

  return (
    <RecurringJournalsListProvider
      tableState={recurringJournalsTableState}
      tableStateChanged={recurringJournalsTableStateChanged}
    >
      <RecurringJournalsActionsBar
        recurringJournalsFilterRoles={
          recurringJournalsTableState?.filterRoles || []
        }
      />
      <RecurringJournalsListContent />
    </RecurringJournalsListProvider>
  );
}

export const RecurringJournalsList = FF.pipe(
  RecurringJournalsListInner,
  withRecurringJournals(
    ({ recurringJournalsTableState, recurringJournalsTableStateChanged }) => ({
      recurringJournalsTableState,
      recurringJournalsTableStateChanged,
    }),
  ),
  withRecurringJournalsActions,
);
