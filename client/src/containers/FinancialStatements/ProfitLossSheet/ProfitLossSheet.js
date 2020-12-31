import React, {useState, useCallback, useEffect} from 'react';
import moment from 'moment';
import {compose} from 'utils';
import { useQuery } from 'react-query';
import { useIntl } from 'react-intl';
import { queryCache } from 'react-query';

import ProfitLossSheetHeader from './ProfitLossSheetHeader';
import ProfitLossSheetTable from './ProfitLossSheetTable';
import ProfitLossActionsBar from './ProfitLossActionsBar';

import DashboardInsider from 'components/Dashboard/DashboardInsider'
import DashboardPageContent from 'components/Dashboard/DashboardPageContent'

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withProfitLossActions from './withProfitLossActions';
import withProfitLoss from './withProfitLoss';
import withSettings from 'containers/Settings/withSettings';

import { transformFilterFormToQuery } from 'containers/FinancialStatements/common';

function ProfitLossSheet({
  // #withDashboardActions
  changePageTitle,
  setDashboardBackLink,

  // #withProfitLoss
  profitLossSheetRefresh,

  // #withProfitLossActions
  fetchProfitLossSheet,
  refreshProfitLossSheet,

  // #withPreferences
  organizationName,
}) {
  const [filter, setFilter] = useState({
    basis: 'cash',
    fromDate: moment().startOf('year').format('YYYY-MM-DD'),
    toDate: moment().endOf('year').format('YYYY-MM-DD'),
    displayColumnsType: 'total',
    accountsFilter: 'all-accounts',
  });
  const { formatMessage } = useIntl();

  // Change page title of the dashboard.
  useEffect(() => {
    changePageTitle(formatMessage({ id: 'profit_loss_sheet' }));
  }, [changePageTitle, formatMessage]);

  // Observes the P&L sheet refresh to invalid the query to refresh it.
  useEffect(() => {
    if (profitLossSheetRefresh) {
      refreshProfitLossSheet(false);
      queryCache.invalidateQueries('profit-loss-sheet');
    }
  }, [profitLossSheetRefresh, refreshProfitLossSheet]);

  useEffect(() => {
    // Show the back link on dashboard topbar.
    setDashboardBackLink(true);

    return () => {
      // Hide the back link on dashboard topbar.
      setDashboardBackLink(false);
    };
  });

  // Fetches profit/loss sheet.
  const fetchSheetHook = useQuery(['profit-loss-sheet', filter],
    (key, query) => fetchProfitLossSheet({ ...transformFilterFormToQuery(query) }),
    { manual: true });

  // Handle submit filter.
  const handleSubmitFilter = useCallback((filter) => {
    const _filter = {
      ...filter,
      fromDate: moment(filter.fromDate).format('YYYY-MM-DD'),
      toDate: moment(filter.toDate).format('YYYY-MM-DD'),
    };
    setFilter(_filter);
  }, [setFilter]);

  return (
    <DashboardInsider>
      <ProfitLossActionsBar />
 
      <DashboardPageContent>
        <div class="financial-statement">
          <ProfitLossSheetHeader
            pageFilter={filter}
            onSubmitFilter={handleSubmitFilter} />

          <div class="financial-statement__body">
            <ProfitLossSheetTable
              companyName={organizationName}
              profitLossQuery={filter} />
          </div>
        </div>
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export default compose(
  withDashboardActions,
  withProfitLossActions,
  withProfitLoss(({ profitLossSheetRefresh }) => ({ profitLossSheetRefresh })),
  withSettings(({ organizationSettings }) => ({
    organizationName: organizationSettings.name,
  })),
)(ProfitLossSheet);