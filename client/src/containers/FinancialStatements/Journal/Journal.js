import React, { useState, useCallback, useEffect } from 'react';
import moment from 'moment';
import { useIntl } from 'react-intl';

import { compose } from 'utils';
import JournalTable from './JournalTable';

import JournalHeader from './JournalHeader';
import JournalActionsBar from './JournalActionsBar';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import { JournalSheetProvider } from './JournalProvider';

import withSettings from 'containers/Settings/withSettings';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withJournalActions from './withJournalActions';

import 'style/pages/FinancialStatements/Journal.scss';

/**
 * Journal sheet.
 */
function Journal({
  // #withPreferences
  organizationName,

  // #withJournalActions
  toggleJournalSheetFilter
}) {
  const [filter, setFilter] = useState({
    fromDate: moment().startOf('year').format('YYYY-MM-DD'),
    toDate: moment().endOf('year').format('YYYY-MM-DD'),
    basis: 'accural',
  });

  // Handle financial statement filter change.
  const handleFilterSubmit = useCallback(
    (filter) => {
      const _filter = {
        ...filter,
        fromDate: moment(filter.fromDate).format('YYYY-MM-DD'),
        toDate: moment(filter.toDate).format('YYYY-MM-DD'),
      };
      setFilter(_filter);
    },
    [setFilter],
  );

  // Hide the journal sheet filter drawer once the page unmount.
  useEffect(() => () => {
    toggleJournalSheetFilter(false);
  }, [toggleJournalSheetFilter]);

  return (
    <JournalSheetProvider query={filter}>
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
    </JournalSheetProvider>
  );
}

export default compose(
  withDashboardActions,
  withJournalActions,
  withSettings(({ organizationSettings }) => ({
    organizationName: organizationSettings.name,
  })),
)(Journal);
