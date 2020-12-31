import React, { useEffect, useCallback, useState } from 'react';

import { compose } from 'utils';
import { useQuery } from 'react-query';
import moment from 'moment';
import { useIntl } from 'react-intl';
import { queryCache } from 'react-query';

import BalanceSheetHeader from './BalanceSheetHeader';
import BalanceSheetTable from './BalanceSheetTable';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import BalanceSheetActionsBar from './BalanceSheetActionsBar';
import { FinancialStatement } from 'components';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withSettings from 'containers/Settings/withSettings';
import withBalanceSheetActions from './withBalanceSheetActions';
import withBalanceSheetDetail from './withBalanceSheetDetail';

import { transformFilterFormToQuery } from 'containers/FinancialStatements/common';

function BalanceSheet({
  // #withDashboardActions
  changePageTitle,
  setDashboardBackLink,

  // #withBalanceSheetActions
  fetchBalanceSheet,
  refreshBalanceSheet,

  // #withBalanceSheetDetail
  balanceSheetRefresh,

  // #withPreferences
  organizationName,
}) {
  const { formatMessage } = useIntl();

  const [filter, setFilter] = useState({
    fromDate: moment().startOf('year').format('YYYY-MM-DD'),
    toDate: moment().endOf('year').format('YYYY-MM-DD'),
    basis: 'cash',
    displayColumnsType: 'total',
    accountsFilter: 'all-accounts',
  });

  // Fetches the balance sheet.
  const fetchHook = useQuery(['balance-sheet', filter], (key, query) =>
    fetchBalanceSheet({ ...transformFilterFormToQuery(query) }),
  );

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'balance_sheet' }));
  }, [changePageTitle, formatMessage]);

  // Observes the balance sheet refresh to invalid the query to refresh it.
  useEffect(() => {
    if (balanceSheetRefresh) {
      queryCache.invalidateQueries('balance-sheet');
      refreshBalanceSheet(false);
    }
  }, [balanceSheetRefresh, refreshBalanceSheet]);

  useEffect(() => {
    // Show the back link on dashboard topbar.
    setDashboardBackLink(true);

    return () => {
      // Hide the back link on dashboard topbar.
      setDashboardBackLink(false);
    };
  });

  // Handle re-fetch balance sheet after filter change.
  const handleFilterSubmit = useCallback(
    (filter) => {
      const _filter = {
        ...filter,
        fromDate: moment(filter.fromDate).format('YYYY-MM-DD'),
        toDate: moment(filter.toDate).format('YYYY-MM-DD'),
      };
      setFilter({ ..._filter });
      refreshBalanceSheet(true);
    },
    [setFilter, refreshBalanceSheet],
  );

  return (
    <DashboardInsider>
      <BalanceSheetActionsBar />

      <DashboardPageContent>
        <FinancialStatement>
          <BalanceSheetHeader
            pageFilter={filter}
            onSubmitFilter={handleFilterSubmit}
          />
          <div class="financial-statement__body">
            <BalanceSheetTable companyName={organizationName} />
          </div>
        </FinancialStatement>
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export default compose(
  withDashboardActions,
  withBalanceSheetActions,
  withBalanceSheetDetail(({ balanceSheetRefresh }) => ({
    balanceSheetRefresh,
  })),
  withSettings(({ organizationSettings }) => ({
    organizationName: organizationSettings.name,
  })),
)(BalanceSheet);
