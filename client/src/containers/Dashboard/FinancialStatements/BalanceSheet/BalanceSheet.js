import React, {useEffect, useMemo, useCallback, useState} from 'react';
import DashboardConnect from 'connectors/Dashboard.connector';
import {compose} from 'utils';
import useAsync from 'hooks/async';
import FinancialStatementConnect from 'connectors/FinancialStatements.connector';
import {useIntl} from 'react-intl';
import BalanceSheetHeader from './BalanceSheetHeader';
import LoadingIndicator from 'components/LoadingIndicator';
import BalanceSheetTable from './BalanceSheetTable';
import moment from 'moment';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import BalanceSheetActionsBar from './BalanceSheetActionsBar';

function BalanceSheet({
  fetchBalanceSheet,
  changePageTitle,
  getBalanceSheetByQuery,
  getBalanceSheetIndexByQuery,
  getBalanceSheetByIndex,
  balanceSheets
}) {
  const intl = useIntl();
  const [filter, setFilter] = useState({
    from_date: moment().startOf('year').format('YYYY-MM-DD'),
    to_date: moment().endOf('year').format('YYYY-MM-DD'),
    basis: 'cash',
    display_columns_type: 'total',
    display_columns_by: '',
    none_zero: false,
  });
 
  const fetchHook = useAsync(async (query = filter) => { 
    await Promise.all([
      fetchBalanceSheet({ ...query }),
    ]);
  });

  // Handle fetch the data of balance sheet.
  const handleFetchData = useCallback(() => { fetchHook.execute(); }, [fetchHook]);

  useEffect(() => {
    changePageTitle('Balance Sheet');
  }, []);

  // Retrieve balance sheet index by the given filter query.
  const balanceSheetIndex = useMemo(() => 
    getBalanceSheetIndexByQuery(filter),
    [filter, getBalanceSheetIndexByQuery]);

  // Retreive balance sheet by the given sheet index.
  const balanceSheet = useMemo(() => 
    getBalanceSheetByIndex(balanceSheetIndex),
    [balanceSheetIndex, getBalanceSheetByIndex]);

  // Handle re-fetch balance sheet after filter change.
  const handleFilterSubmit = useCallback((filter) => {
    const _filter = {
      ...filter,
      from_date: moment(filter.from_date).format('YYYY-MM-DD'),
      to_date: moment(filter.to_date).format('YYYY-MM-DD'),
    };
    setFilter({ ..._filter });
    fetchHook.execute(_filter);
  }, [setFilter, fetchHook]);

  return (
    <DashboardInsider>
      <BalanceSheetActionsBar />

      <DashboardPageContent>
        <div class="financial-statement">
          <BalanceSheetHeader
            pageFilter={filter}
            onSubmitFilter={handleFilterSubmit} />

          <div class="financial-statement__body">
            <LoadingIndicator loading={fetchHook.pending}>
              <BalanceSheetTable
                balanceSheet={balanceSheet}
                balanceSheetIndex={balanceSheetIndex}
                onFetchData={handleFetchData}
                asDate={new Date()} />
            </LoadingIndicator>
          </div>
        </div>
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export default compose(
  DashboardConnect,
  FinancialStatementConnect,
)(BalanceSheet);