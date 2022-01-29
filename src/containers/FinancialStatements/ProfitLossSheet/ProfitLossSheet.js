import React, { useState } from 'react';
import moment from 'moment';
import { compose } from 'utils';

import ProfitLossSheetHeader from './ProfitLossSheetHeader';
import ProfitLossSheetTable from './ProfitLossSheetTable';
import ProfitLossActionsBar from './ProfitLossActionsBar';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withProfitLossActions from './withProfitLossActions';
import withCurrentOrganization from '../../Organization/withCurrentOrganization';

import 'style/pages/FinancialStatements/ProfitLossSheet.scss';
import { ProfitLossSheetProvider } from './ProfitLossProvider';
import { ProfitLossSheetLoadingBar, ProfitLossSheetAlerts } from './components';

/**
 * Profit/Loss financial statement sheet.
 */
function ProfitLossSheet({
  // #withPreferences
  organizationName,

  // #withProfitLossActions
  toggleProfitLossFilterDrawer: toggleDisplayFilterDrawer,
}) {
  const [filter, setFilter] = useState({
    basis: 'cash',
    fromDate: moment().startOf('year').format('YYYY-MM-DD'),
    toDate: moment().endOf('year').format('YYYY-MM-DD'),
    displayColumnsType: 'total',
    filterByOption: 'with-transactions',
  });

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
  // Hide the filter drawer once the page unmount.
  React.useEffect(
    () => () => {
      toggleDisplayFilterDrawer(false);
    },
    [toggleDisplayFilterDrawer],
  );

  return (
    <ProfitLossSheetProvider query={filter}>
      <ProfitLossActionsBar
        numberFormat={filter.numberFormat}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
      {/* <ProfitLossSheetLoadingBar /> */}
      {/* <ProfitLossSheetAlerts /> */}

      <DashboardPageContent>
        <div class="financial-statement">
          <ProfitLossSheetHeader
            pageFilter={filter}
            onSubmitFilter={handleSubmitFilter}
          />
          <div class="financial-statement__body">
            <ProfitLossSheetTable companyName={organizationName} />
          </div>
        </div>
      </DashboardPageContent>
    </ProfitLossSheetProvider>
  );
}

export default compose(
  withDashboardActions,
  withProfitLossActions,
  withCurrentOrganization(({ organization }) => ({
    organizationName: organization.name,
  })),
)(ProfitLossSheet);
