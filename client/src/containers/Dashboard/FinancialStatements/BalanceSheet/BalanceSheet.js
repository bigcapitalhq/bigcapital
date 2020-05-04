import React, {useEffect, useMemo, useCallback, useState} from 'react';
import DashboardConnect from 'connectors/Dashboard.connector';
import {compose} from 'utils';
import useAsync from 'hooks/async';
import BalanceSheetConnect from 'connectors/BalanceSheet.connect';
import {useIntl} from 'react-intl';
import BalanceSheetHeader from './BalanceSheetHeader';
import BalanceSheetTable from './BalanceSheetTable';
import moment from 'moment';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import BalanceSheetActionsBar from './BalanceSheetActionsBar';
import SettingsConnect from 'connectors/Settings.connect';

function BalanceSheet({
  fetchBalanceSheet,
  changePageTitle,
  balanceSheetLoading, 
  getBalanceSheetIndex,
  getBalanceSheet,
  organizationSettings
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
  }, false);

  // Handle fetch the data of balance sheet.
  const handleFetchData = useCallback(() => { fetchHook.execute(); }, [fetchHook]);

  useEffect(() => {
    changePageTitle('Balance Sheet');
  }, []);

  // Retrieve balance sheet index by the given filter query.
  const balanceSheetIndex = useMemo(() => 
    getBalanceSheetIndex(filter),
    [filter, getBalanceSheetIndex]);

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
            <BalanceSheetTable
              companyName={organizationSettings.name}
              loading={balanceSheetLoading}
              balanceSheetIndex={balanceSheetIndex}
              onFetchData={handleFetchData} />
          </div>
        </div>
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export default compose(
  DashboardConnect,
  BalanceSheetConnect,
  SettingsConnect,
)(BalanceSheet);