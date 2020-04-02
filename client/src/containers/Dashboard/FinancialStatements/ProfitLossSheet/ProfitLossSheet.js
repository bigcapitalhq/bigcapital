import React, {useState, useMemo, useCallback, useEffect} from 'react';
import ProfitLossSheetHeader from './ProfitLossSheetHeader';
import ProfitLossSheetTable from './ProfitLossSheetTable';
import LoadingIndicator from 'components/LoadingIndicator';
import useAsync from 'hooks/async';
import {compose} from 'utils';
import DashboardConnect from 'connectors/Dashboard.connector';
import ProfitLossSheetConnect from 'connectors/ProfitLossSheet.connect';
import DashboardInsider from 'components/Dashboard/DashboardInsider'
import DashboardPageContent from 'components/Dashboard/DashboardPageContent'
import ProfitLossActionsBar from './ProfitLossActionsBar';
import moment from 'moment';

function ProfitLossSheet({
  changePageTitle,
  fetchProfitLossSheet,

  getProfitLossSheetIndex,
  getProfitLossSheet,
}) {
  const [filter, setFilter] = useState({
    from_date: moment().startOf('year').format('YYYY-MM-DD'),
    to_date: moment().endOf('year').format('YYYY-MM-DD'),
  });

  // Change page title of the dashboard.
  useEffect(() => {
    changePageTitle('Profit/Loss Sheet');
  }, []);

  // Fetches profit/loss sheet.
  const fetchHook = useAsync((query = filter) => {
    return Promise.all([
      fetchProfitLossSheet(query),
    ]);
  }, false);

  const profitLossSheetIndex = useMemo(() =>
    getProfitLossSheetIndex(filter),
    [getProfitLossSheetIndex, filter])

  const profitLossSheet = useMemo(() => 
    getProfitLossSheet(profitLossSheetIndex),
    [getProfitLossSheet, profitLossSheetIndex]);

  const handleSubmitFilter = useCallback((filter) => {
    const _filter = {
      ...filter,
      from_date: moment(filter.from_date).format('YYYY-MM-DD'),
      to_date: moment(filter.to_date).format('YYYY-MM-DD'),
    };
    setFilter(_filter);
    fetchHook.execute(_filter);
  }, []);

  // Handle fetch data of profit/loss sheet table.
  const handleFetchData = useCallback(() => {
    fetchHook.execute();
  }, [fetchHook]);

  return (
    <DashboardInsider>
      <ProfitLossActionsBar  />

      <div class="financial-statement">
        <ProfitLossSheetHeader
          pageFilter={filter}
          onSubmitFilter={handleSubmitFilter} />

        <div class="financial-statement__body">
          <LoadingIndicator loading={false}>
            <ProfitLossSheetTable
              data={[]}
              onFetchData={handleFetchData} />
          </LoadingIndicator>
        </div> 
      </div>
    </DashboardInsider>
  );
}

export default compose(
  DashboardConnect,
  ProfitLossSheetConnect
)(ProfitLossSheet);