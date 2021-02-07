import React, { useEffect, useState } from 'react';

import { compose } from 'utils';

import moment from 'moment';
import { useIntl } from 'react-intl';

import 'style/pages/FinancialStatements/BalanceSheet.scss';

import BalanceSheetHeader from './BalanceSheetHeader';
import BalanceSheetTable from './BalanceSheetTable';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import BalanceSheetActionsBar from './BalanceSheetActionsBar';

import { FinancialStatement } from 'components';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withSettings from 'containers/Settings/withSettings';

import { BalanceSheetProvider } from './BalanceSheetProvider';

/**
 * Balance sheet.
 */
function BalanceSheet({
  // #withDashboardActions
  changePageTitle,
  setDashboardBackLink,
  setSidebarShrink,

  // #withPreferences
  organizationName,
}) {
  const { formatMessage } = useIntl();

  const [filter, setFilter] = useState({
    fromDate: moment().startOf('year').format('YYYY-MM-DD'),
    toDate: moment().endOf('year').format('YYYY-MM-DD'),
    basis: 'cash',
    displayColumnsType: 'total',
    accountsFilter: 'all-accounts',
  });

  useEffect(() => {
    setSidebarShrink();
    changePageTitle(formatMessage({ id: 'balance_sheet' }));
  }, [changePageTitle, formatMessage, setSidebarShrink]);

  useEffect(() => {
    // Show the back link on dashboard topbar.
    setDashboardBackLink(true);

    return () => {
      // Hide the back link on dashboard topbar.
      setDashboardBackLink(false);
    };
  }, [setDashboardBackLink]);

  // Handle re-fetch balance sheet after filter change.
  const handleFilterSubmit = (filter) => {
    const _filter = {
      ...filter,
      fromDate: moment(filter.fromDate).format('YYYY-MM-DD'),
      toDate: moment(filter.toDate).format('YYYY-MM-DD'),
    };
    setFilter({ ..._filter });
  };

  const handleNumberFormatSubmit = (values) => {
    setFilter({
      ...filter,
      numberFormat: values,
    });
  };

  return (
    <BalanceSheetProvider query={filter}>
      <BalanceSheetActionsBar
        numberFormat={filter.numberFormat}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
      <DashboardPageContent>
        <FinancialStatement>
          <BalanceSheetHeader
            pageFilter={filter}
            onSubmitFilter={handleFilterSubmit}
          />
          <div class="financial-statement__body">
            <BalanceSheetTable companyName={organizationName} />
          </div>
        </FinancialStatement>
      </DashboardPageContent>
    </BalanceSheetProvider>
  );
}

export default compose(
  withDashboardActions,
  withSettings(({ organizationSettings }) => ({
    organizationName: organizationSettings.name,
  })),
)(BalanceSheet);
