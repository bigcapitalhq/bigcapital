import React, {useState, useCallback, useEffect} from 'react';
import moment from 'moment';
import {compose} from 'utils';
import { useQuery } from 'react-query';

import ProfitLossSheetHeader from './ProfitLossSheetHeader';
import ProfitLossSheetTable from './ProfitLossSheetTable';
import ProfitLossActionsBar from './ProfitLossActionsBar';

import DashboardInsider from 'components/Dashboard/DashboardInsider'
import DashboardPageContent from 'components/Dashboard/DashboardPageContent'

import withDashboard from 'containers/Dashboard/withDashboard';
import withProfitLossActions from './withProfitLossActions';
import withProfitLoss from './withProfitLoss';
import SettingsConnect from 'connectors/Settings.connect';


function ProfitLossSheet({
  // #withDashboard
  changePageTitle,

  // #withProfitLossActions
  fetchProfitLossSheet,

  // #withProfitLoss
  profitLossSheetLoading,

  // #withPreferences
  organizationSettings,
}) {
  const [filter, setFilter] = useState({
    basis: 'cash',
    from_date: moment().startOf('year').format('YYYY-MM-DD'),
    to_date: moment().endOf('year').format('YYYY-MM-DD'),
  });

  // Change page title of the dashboard.
  useEffect(() => {
    changePageTitle('Profit/Loss Sheet');
  }, [changePageTitle]);

  // Fetches profit/loss sheet.
  const fetchHook = useQuery(['profit-loss', filter],
    (key, query) => fetchProfitLossSheet(query),
    { manual: true });

  // Handle submit filter.
  const handleSubmitFilter = useCallback((filter) => {
    const _filter = {
      ...filter,
      from_date: moment(filter.from_date).format('YYYY-MM-DD'),
      to_date: moment(filter.to_date).format('YYYY-MM-DD'),
    };
    setFilter(_filter);
    fetchHook.refetch({ force: true });
  }, []);

  // Handle fetch data of profit/loss sheet table.
  const handleFetchData = useCallback(() => {
    fetchHook.refetch({ force: true });
  }, []);

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
              companyName={organizationSettings.name}
              profitLossQuery={filter}
              onFetchData={handleFetchData}
              loading={profitLossSheetLoading} />
          </div> 
        </div>
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export default compose(
  withDashboard,
  withProfitLossActions,
  withProfitLoss(({ profitLossSheetLoading }) => ({
    profitLossSheetLoading,
  })),
  SettingsConnect,
)(ProfitLossSheet);