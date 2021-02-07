import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { compose } from 'utils';
import { useIntl } from 'react-intl';

import ProfitLossSheetHeader from './ProfitLossSheetHeader';
import ProfitLossSheetTable from './ProfitLossSheetTable';
import ProfitLossActionsBar from './ProfitLossActionsBar';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withProfitLossActions from './withProfitLossActions';
import withSettings from 'containers/Settings/withSettings';

import 'style/pages/FinancialStatements/ProfitLossSheet.scss';
import { ProfitLossSheetProvider } from './ProfitLossProvider';

/**
 * Profit/Loss financial statement sheet.
 */
function ProfitLossSheet({
  // #withDashboardActions
  changePageTitle,
  setDashboardBackLink,
  setSidebarShrink,

  // #withPreferences
  organizationName,
}) {
  const [filter, setFilter] = useState({
    basis: 'cash',
    fromDate: moment().startOf('year').format('YYYY-MM-DD'),
    toDate: moment().endOf('year').format('YYYY-MM-DD'),
    displayColumnsType: 'total',
    accountsFilter: 'all-accounts',
  });
  const { formatMessage } = useIntl();

  // Change page title of the dashboard.
  useEffect(() => {
    changePageTitle(formatMessage({ id: 'profit_loss_sheet' }));
  }, [changePageTitle, formatMessage]);

  useEffect(() => {
    setSidebarShrink();
    // Show the back link on dashboard topbar.
    setDashboardBackLink(true);

    return () => {
      // Hide the back link on dashboard topbar.
      setDashboardBackLink(false);
    };
  }, [setDashboardBackLink, setSidebarShrink]);

  // Handle submit filter.
  const handleSubmitFilter = (filter) => {
    const _filter = {
      ...filter,
      fromDate: moment(filter.fromDate).format('YYYY-MM-DD'),
      toDate: moment(filter.toDate).format('YYYY-MM-DD'),
    };
    setFilter(_filter);
  };

  // Handle number format submit.
  const handleNumberFormatSubmit = (numberFormat) => {
    setFilter({
      ...filter,
      numberFormat,
    });
  };

  return (
    <ProfitLossSheetProvider query={filter}>
      <ProfitLossActionsBar
        numberFormat={filter.numberFormat}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />

      <DashboardPageContent>
        <div class="financial-statement">
          <ProfitLossSheetHeader
            pageFilter={filter}
            onSubmitFilter={handleSubmitFilter}
          />

          <div class="financial-statement__body">
            <ProfitLossSheetTable
              companyName={organizationName}
            />
          </div>
        </div>
      </DashboardPageContent>
    </ProfitLossSheetProvider>
  );
}

export default compose(
  withDashboardActions,
  withProfitLossActions,
  withSettings(({ organizationSettings }) => ({
    organizationName: organizationSettings.name,
  })),
)(ProfitLossSheet);
