import React, {useEffect, useMemo, useCallback, useState} from 'react';

import {compose} from 'utils';
import { useQuery } from 'react-query';
import { useIntl } from 'react-intl';
import moment from 'moment';

import BalanceSheetHeader from './BalanceSheetHeader';
import BalanceSheetTable from './BalanceSheetTable';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import BalanceSheetActionsBar from './BalanceSheetActionsBar';

import withDashboard from 'containers/Dashboard/withDashboard';
import withSettings from 'containers/Settings/withSettings';
import withBalanceSheetActions from './withBalanceSheetActions';
import withBalanceSheetDetail from './withBalanceSheetDetail';


function BalanceSheet({
  // #withDashboard
  changePageTitle,

  // #withBalanceSheetActions
  fetchBalanceSheet,
  
  // #withBalanceSheetDetail
  balanceSheetLoading,

  // #withPreferences
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
  const [refetch, setRefetch] = useState(false);
 
  const fetchHook = useQuery(['balance-sheet', filter],
    (key, query) => fetchBalanceSheet({ ...query }),
    { manual: true });

  // Handle fetch the data of balance sheet.
  const handleFetchData = useCallback(() => {
    setRefetch(true);
  }, []);

  useEffect(() => {
    changePageTitle('Balance Sheet');
  }, []);

  // Handle re-fetch balance sheet after filter change.
  const handleFilterSubmit = useCallback((filter) => {
    const _filter = {
      ...filter,
      from_date: moment(filter.from_date).format('YYYY-MM-DD'),
      to_date: moment(filter.to_date).format('YYYY-MM-DD'),
    };
    setFilter({ ..._filter });
    setRefetch(true);
  }, [setFilter]);

  // Refetch sheet effect.
  useEffect(() => {
    if (refetch) {
      fetchHook.refetch({ force: true });
      setRefetch(false);
    }    
  }, [refetch])

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
              balanceSheetQuery={filter}
              onFetchData={handleFetchData} />
          </div>
        </div>
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export default compose(
  withDashboard,
  withBalanceSheetActions,
  withBalanceSheetDetail(({ balanceSheetLoading }) => ({
    balanceSheetLoading,
  })),
  withSettings,
)(BalanceSheet);