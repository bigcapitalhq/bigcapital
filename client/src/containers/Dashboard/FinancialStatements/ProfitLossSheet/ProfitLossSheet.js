import React, {useState, useMemo, useCallback, useEffect} from 'react';
import moment from 'moment';
import useAsync from 'hooks/async';
import {compose} from 'utils';
import ProfitLossSheetHeader from './ProfitLossSheetHeader';
import ProfitLossSheetTable from './ProfitLossSheetTable';
import DashboardConnect from 'connectors/Dashboard.connector';
import ProfitLossSheetConnect from 'connectors/ProfitLossSheet.connect';
import DashboardInsider from 'components/Dashboard/DashboardInsider'
import DashboardPageContent from 'components/Dashboard/DashboardPageContent'
import ProfitLossActionsBar from './ProfitLossActionsBar';
import SettingsConnect from 'connectors/Settings.connect';


function ProfitLossSheet({
  changePageTitle,
  fetchProfitLossSheet,
  getProfitLossSheetIndex,
  profitLossSheetLoading,
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
  const fetchHook = useAsync((query = filter) => {
    return Promise.all([
      fetchProfitLossSheet(query),
    ]);
  }, false);

  // Retrieve profit/loss sheet index based on the given filter query.
  const profitLossSheetIndex = useMemo(() =>
    getProfitLossSheetIndex(filter),
    [getProfitLossSheetIndex, filter]);

  // Handle submit filter.
  const handleSubmitFilter = useCallback((filter) => {
    const _filter = {
      ...filter,
      from_date: moment(filter.from_date).format('YYYY-MM-DD'),
      to_date: moment(filter.to_date).format('YYYY-MM-DD'),
    };
    setFilter(_filter);
    fetchHook.execute(_filter);
  }, [fetchHook]);

  // Handle fetch data of profit/loss sheet table.
  const handleFetchData = useCallback(() => { fetchHook.execute(); }, [fetchHook]);

  return (
    <DashboardInsider>
      <ProfitLossActionsBar  />
      
      <DashboardPageContent>
        <div class="financial-statement">
          <ProfitLossSheetHeader
            pageFilter={filter}
            onSubmitFilter={handleSubmitFilter} />

          <div class="financial-statement__body">
            <ProfitLossSheetTable
              companyName={organizationSettings.name}
              profitLossSheetIndex={profitLossSheetIndex}
              onFetchData={handleFetchData}
              loading={profitLossSheetLoading} />
          </div> 
        </div>
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export default compose(
  DashboardConnect,
  ProfitLossSheetConnect,
  SettingsConnect,
)(ProfitLossSheet);