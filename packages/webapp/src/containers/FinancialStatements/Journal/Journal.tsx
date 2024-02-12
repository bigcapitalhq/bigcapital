// @ts-nocheck
import React, { useCallback, useEffect } from 'react';
import moment from 'moment';

import { FinancialStatement, DashboardPageContent } from '@/components';

import JournalHeader from './JournalHeader';
import JournalActionsBar from './JournalActionsBar';
import { JournalBody } from './JournalBody';
import { JournalSheetProvider } from './JournalProvider';
import { JournalSheetLoadingBar, JournalSheetAlerts } from './components';

import withDashboardActions from '@/containers/Dashboard/withDashboardActions';
import withJournalActions from './withJournalActions';

import { useJournalQuery } from './utils';
import { compose } from '@/utils';
import { JournalDialogs } from './JournalDialogs';

/**
 * Journal sheet.
 */
function Journal({
  // #withJournalActions
  toggleJournalSheetFilter,
}) {
  const { query, setLocationQuery } = useJournalQuery();

  // Handle financial statement filter change.
  const handleFilterSubmit = useCallback(
    (filter) => {
      const _filter = {
        ...filter,
        fromDate: moment(filter.fromDate).format('YYYY-MM-DD'),
        toDate: moment(filter.toDate).format('YYYY-MM-DD'),
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

export default compose(withDashboardActions, withJournalActions)(Journal);
