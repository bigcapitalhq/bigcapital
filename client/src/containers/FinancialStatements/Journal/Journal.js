import React, { useState, useCallback, useEffect } from 'react';
import { useQuery } from 'react-query';
import moment from 'moment';
import { useIntl } from 'react-intl';
import { queryCache } from 'react-query';

import { compose } from 'utils';
import JournalTable from './JournalTable';

import JournalHeader from './JournalHeader';
import JournalActionsBar from './JournalActionsBar';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import withSettings from 'containers/Settings/withSettings';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withJournalActions from './withJournalActions';
import withJournal from './withJournal';

import { transformFilterFormToQuery } from 'containers/FinancialStatements/common';

function Journal({
  // #withJournalActions
  requestFetchJournalSheet,
  refreshJournalSheet,

  // #withJournal
  journalSheetRefresh,

  // #withDashboardActions
  changePageTitle,
  setDashboardBackLink,

  // #withPreferences
  organizationName,
}) {
  const [filter, setFilter] = useState({
    fromDate: moment().startOf('year').format('YYYY-MM-DD'),
    toDate: moment().endOf('year').format('YYYY-MM-DD'),
    basis: 'accural',
  });
  const { formatMessage } = useIntl();

  const fetchJournalSheet = useQuery(['journal-sheet', filter], (key, query) =>
    requestFetchJournalSheet({
      ...transformFilterFormToQuery(filter),
    }),
  );

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'journal_sheet' }));
  }, [changePageTitle, formatMessage]);

  useEffect(() => {
    // Show the back link on dashboard topbar.
    setDashboardBackLink(true);

    return () => {
      // Hide the back link on dashboard topbar.
      setDashboardBackLink(false);
    };
  });

  useEffect(() => {
    if (journalSheetRefresh) {
      queryCache.invalidateQueries('journal-sheet');
      refreshJournalSheet(false);
    }
  }, [journalSheetRefresh, refreshJournalSheet]);

  // Handle financial statement filter change.
  const handleFilterSubmit = useCallback(
    (filter) => {
      const _filter = {
        ...filter,
        fromDate: moment(filter.fromDate).format('YYYY-MM-DD'),
        toDate: moment(filter.toDate).format('YYYY-MM-DD'),
      };
      setFilter(_filter);
      queryCache.invalidateQueries('journal-sheet');
    },
    [setFilter],
  );
  return (
    <DashboardInsider>
      <JournalActionsBar />

      <DashboardPageContent>
        <div class="financial-statement financial-statement--journal">
          <JournalHeader
            onSubmitFilter={handleFilterSubmit}
            pageFilter={filter}
          />

          <div class="financial-statement__body">
            <JournalTable
              companyName={organizationName}
              journalQuery={filter}
            />
          </div>
        </div>
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export default compose(
  withDashboardActions,
  withJournalActions,
  withSettings(({ organizationSettings }) => ({
    organizationName: organizationSettings.name,
  })),
  withJournal(({ journalSheetRefresh }) => ({
    journalSheetRefresh,
  })),
)(Journal);
