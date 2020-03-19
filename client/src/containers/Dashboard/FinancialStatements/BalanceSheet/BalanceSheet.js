import React, {useEffect, useMemo, useState} from 'react';
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
      fetchBalanceSheet(filter),
    ]);
    setReload(false);
  });

  useEffect(() => {
    if (!reload) { return; }
    fetchHook.execute();
  }, [reload]);

  useEffect(() => {
    changePageTitle('Balance Sheet');
  }, []);

  // Retrieve balance sheet index by the given filter query.
  const balanceSheetIndex = useMemo(() => {
    return getBalanceSheetIndexByQuery(filter);
  }, [filter, balanceSheets]);

  // Retreive balance sheet by the given sheet index.
  const balanceSheet = useMemo(() => {  
    return getBalanceSheetByIndex(balanceSheetIndex);
  }, [balanceSheetIndex, balanceSheets]);

  // Handle re-fetch balance sheet after filter change.
  const handleFilterSubmit = (filter) => {
    setFilter({
      ...filter,
      from_date: moment(filter.from_date).format('YYYY-MM-DD'),
      to_date: moment(filter.to_date).format('YYYY-MM-DD'),
    });
    setReload(true);
  };
  return (
    <div class="financial-statement">
      <BalanceSheetHeader
        pageFilter={filter}
        onSubmitFilter={handleFilterSubmit} />

      <div class="financial-statement__body">
        <LoadingIndicator loading={fetchHook.pending}>
          <BalanceSheetTable
            balanceSheet={balanceSheet}
            balanceSheetIndex={balanceSheetIndex} />
        </LoadingIndicator>
      </div>
    </div>
  );
}

export default compose(
  DashboardConnect,
  FinancialStatementConnect,
)(BalanceSheet);