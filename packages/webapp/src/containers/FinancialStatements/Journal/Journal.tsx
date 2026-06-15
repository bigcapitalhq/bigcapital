import React, { useCallback, useEffect } from 'react';
import moment from 'moment';

import { FinancialStatement, DashboardPageContent } from '@/components';

import { JournalHeader } from './JournalHeader';
import { JournalActionsBar } from './JournalActionsBar';
import { JournalBody } from './JournalBody';
import { JournalSheetProvider } from './JournalProvider';
import { JournalSheetLoadingBar, JournalSheetAlerts } from './components';

import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import type { WithDashboardActionsProps } from '@/containers/Dashboard/withDashboardActions';
import { withJournalActions } from './withJournalActions';
import type { WithJournalActionsProps } from './withJournalActions';

import { useJournalQuery } from './utils';
import { JournalDialogs } from './JournalDialogs';
import { flow } from 'fp-ts/function';

type JournalProps = WithJournalActionsProps;

/**
 * Journal sheet.
 */
function JournalInner({
  // #withJournalActions
  toggleJournalSheetFilter,
}: JournalProps) {
  const { query, setLocationQuery } = useJournalQuery();

  // Handle financial statement filter change.
  const handleFilterSubmit = useCallback(
    (filter: Record<string, unknown>) => {
      const _filter = {
        ...filter,
        fromDate: moment(filter.fromDate as string).format('YYYY-MM-DD'),
        toDate: moment(filter.toDate as string).format('YYYY-MM-DD'),
      };
      setLocationQuery(_filter);
    },
    [setLocationQuery],
  );
  // Hide the journal sheet filter drawer once the page unmount.
  useEffect(
    () => () => {
      toggleJournalSheetFilter(false);
    },
    [toggleJournalSheetFilter],
  );

  return (
    <JournalSheetProvider query={query}>
      <JournalActionsBar />

      <DashboardPageContent>
        <FinancialStatement>
          <JournalHeader
            onSubmitFilter={handleFilterSubmit}
            pageFilter={query}
          />
          <JournalSheetLoadingBar />
          <JournalSheetAlerts />
          <JournalBody />
        </FinancialStatement>
      </DashboardPageContent>

      <JournalDialogs />
    </JournalSheetProvider>
  );
}

export const Journal = flow(
  withJournalActions,
  withDashboardActions,
)(JournalInner);
