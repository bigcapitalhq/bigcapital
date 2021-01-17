import React, { useEffect, useCallback, useState } from 'react';
import { useQuery } from 'react-query';
import moment from 'moment';
import { useIntl } from 'react-intl';
import { queryCache } from 'react-query';

import TrialBalanceActionsBar from './TrialBalanceActionsBar';
import TrialBalanceSheetHeader from './TrialBalanceSheetHeader';
import TrialBalanceSheetTable from './TrialBalanceSheetTable';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import { compose } from 'utils';
import { transformFilterFormToQuery } from 'containers/FinancialStatements/common';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withTrialBalanceActions from './withTrialBalanceActions';
import withSettings from 'containers/Settings/withSettings';
import withTrialBalance from './withTrialBalance';

import 'style/pages/FinancialStatements/TrialBalanceSheet.scss';

/**
 * Trial balance sheet.
 */
function TrialBalanceSheet({
  // #withDashboardActions
  changePageTitle,
  setDashboardBackLink,

  // #withTrialBalance
  trialBalanceSheetRefresh,

  // #withTrialBalanceActions
  fetchTrialBalanceSheet,
  refreshTrialBalance,

  // #withPreferences
  organizationName,
}) {
  const { formatMessage } = useIntl();

  const [filter, setFilter] = useState({
    fromDate: moment().startOf('year').format('YYYY-MM-DD'),
    toDate: moment().endOf('year').format('YYYY-MM-DD'),
    basis: 'accural',
    accountsFilter: 'all-accounts',
  });

  // Fetches trial balance sheet.
  const fetchSheet = useQuery(
    ['trial-balance-sheet', filter],
    (key, query) =>
      fetchTrialBalanceSheet({
        ...transformFilterFormToQuery(query),
      }),
    { manual: true },
  );
  // Change page title of the dashboard.
  useEffect(() => {
    changePageTitle(formatMessage({ id: 'trial_balance_sheet' }));
  }, [changePageTitle, formatMessage]);

  useEffect(() => {
    // Show the back link on dashboard topbar.
    setDashboardBackLink(true);

    return () => {
      // Hide the back link on dashboard topbar.
      setDashboardBackLink(false);
    };
  });

  const handleFilterSubmit = useCallback(
    (filter) => {
      const parsedFilter = {
        ...filter,
        fromDate: moment(filter.fromDate).format('YYYY-MM-DD'),
        toDate: moment(filter.toDate).format('YYYY-MM-DD'),
      };
      setFilter(parsedFilter);
      refreshTrialBalance(true);
    },
    [setFilter, refreshTrialBalance],
  );

  // Observes the trial balance sheet refresh to invaoid the query.
  useEffect(() => {
    if (trialBalanceSheetRefresh) {
      queryCache.invalidateQueries('trial-balance-sheet');
      refreshTrialBalance(false);
    }
  }, [trialBalanceSheetRefresh, refreshTrialBalance]);

  return (
    <DashboardInsider>
      <TrialBalanceActionsBar />

      <DashboardPageContent>
        <div class="financial-statement">
          <TrialBalanceSheetHeader
            pageFilter={filter}
            onSubmitFilter={handleFilterSubmit}
          />

          <div class="financial-statement__body">
            <TrialBalanceSheetTable companyName={organizationName} />
          </div>
        </div>
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export default compose(
  withDashboardActions,
  withTrialBalanceActions,
  withTrialBalance(({ trialBalanceSheetRefresh }) => ({
    trialBalanceSheetRefresh,
  })),
  withSettings(({ organizationSettings }) => ({
    organizationName: organizationSettings.name,
  })),
)(TrialBalanceSheet);
