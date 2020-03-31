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
    display_columns_by: 'total',
    none_zero: false,
  });
 
  const [reload, setReload] = useState(false);

  const fetchHook = useAsync(async () => { 
    await Promise.all([
      fetchBalanceSheet({
        ...filter,
        display_columns_type: 'total',
      }),
    ]);
    setReload(false);
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
    setFilter({
      ...filter,
      from_date: moment(filter.from_date).format('YYYY-MM-DD'),
      to_date: moment(filter.to_date).format('YYYY-MM-DD'),
    });
    setReload(true);
  }, [setFilter]);

  return (
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
  );
}

export default compose(
  DashboardConnect,
  FinancialStatementConnect,
)(BalanceSheet);