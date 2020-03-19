import React, {useState, useEffect, useMemo} from 'react';
import ProfitLossSheetHeader from './ProfitLossSheetHeader';
import ProfitLossSheetTable from './ProfitLossSheetTable';
import LoadingIndicator from 'components/LoadingIndicator';
import { useAsync } from 'react-use';
import moment from 'moment';
import {compose} from 'utils';
import DashboardConnect from 'connectors/Dashboard.connector';
import ProfitLossSheetConnect from 'connectors/ProfitLossSheet.connect';

function ProfitLossSheet({
  changePageTitle,

  fetchProfitLossSheet,

  getProfitLossSheetIndex,
  getProfitLossSheet,

  getProfitLossSheetAccounts,
  getProfitLossSheetColumns,
}) {
  const [filter, setFilter] = useState({});
  const [reload, setReload] = useState(false);

  // Change page title of the dashboard.
  useEffect(() => {
    changePageTitle('Trial Balance Sheet');
  }, []);

  const fetchHook = useAsync(async () => {
    await Promise.all([
      fetchProfitLossSheet(filter),
    ]);
  });

  const handleFilterSubmit = (filter) => {
    setFilter({
      ...filter,
      from_date: moment(filter.from_date).format('YYYY-MM-DD'),
      to_date: moment(filter.to_date).format('YYYY-MM-DD'),
    });
    setReload(true);
  }

  const profitLossSheetIndex = useMemo(() => {
    return getProfitLossSheetIndex(filter);
  }, [filter, getProfitLossSheetIndex]);

  const profitLossSheetAccounts = useMemo(() => {
    return getProfitLossSheetAccounts(profitLossSheetIndex);
  }, [profitLossSheetIndex, getProfitLossSheet]);

  const profitLossSheetColumns = useMemo(() => {
    return getProfitLossSheetColumns(profitLossSheetIndex);
  }, [profitLossSheetIndex])

  return (
    <div class="financial-statement">
      <ProfitLossSheetHeader
        pageFilter={filter}
        onSubmitFilter={handleFilterSubmit} />

      <div class="financial-statement__body">
        <LoadingIndicator loading={fetchHook.pending}>

          <ProfitLossSheetTable
            accounts={profitLossSheetAccounts}
            columns={profitLossSheetColumns} />
        </LoadingIndicator>
      </div>
    </div>
  );
}

export default compose(
  DashboardConnect,
  ProfitLossSheetConnect
)(ProfitLossSheet);