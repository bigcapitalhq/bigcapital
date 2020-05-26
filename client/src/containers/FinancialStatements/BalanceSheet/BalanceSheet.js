import React, { useEffect, useCallback, useState } from 'react';

import { compose } from 'utils';
import { useQuery } from 'react-query';
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

import { useIntl } from 'react-intl';

function BalanceSheet({
  // #withDashboard
  changePageTitle,

  // #withBalanceSheetActions
  fetchBalanceSheet,

  // #withBalanceSheetDetail
  balanceSheetLoading,

  // #withPreferences
  organizationSettings,
}) {
  const { formatMessage } = useIntl();
  const [filter, setFilter] = useState({
    from_date: moment().startOf('year').format('YYYY-MM-DD'),
    to_date: moment().endOf('year').format('YYYY-MM-DD'),
    basis: 'cash',
    display_columns_type: 'total',
    display_columns_by: '',
    none_zero: false,
  });

  const fetchHook = useQuery(
    ['balance-sheet', filter],
    (key, query) => fetchBalanceSheet({ ...query }),
    { manual: true },
  );

  // Handle fetch the data of balance sheet.
  const handleFetchData = useCallback(() => {
    fetchHook.refetch({ force: true });
  }, []);

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'balance_sheet' }));
  }, [changePageTitle, formatMessage]);

  // Handle re-fetch balance sheet after filter change.
  const handleFilterSubmit = useCallback(
    (filter) => {
      const _filter = {
        ...filter,
        from_date: moment(filter.from_date).format('YYYY-MM-DD'),
        to_date: moment(filter.to_date).format('YYYY-MM-DD'),
      };
      setFilter({ ..._filter });
      fetchHook.refetch({ force: true });
    },
    [setFilter],
  );

  return (
    <DashboardInsider>
      <BalanceSheetActionsBar />

      <DashboardPageContent>
        <div class="financial-statement">
          <BalanceSheetHeader
            pageFilter={filter}
            onSubmitFilter={handleFilterSubmit}
          />

          <div class="financial-statement__body">
            <BalanceSheetTable
              companyName={organizationSettings.name}
              loading={balanceSheetLoading}
              balanceSheetQuery={filter}
              onFetchData={handleFetchData}
            />
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
