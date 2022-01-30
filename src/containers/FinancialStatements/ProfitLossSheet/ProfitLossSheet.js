import React, { useState } from 'react';
import moment from 'moment';
import { compose } from 'utils';

import ProfitLossSheetHeader from './ProfitLossSheetHeader';
import ProfitLossActionsBar from './ProfitLossActionsBar';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withProfitLossActions from './withProfitLossActions';

import { ProfitLossSheetProvider } from './ProfitLossProvider';
import { ProfitLossSheetLoadingBar, ProfitLossSheetAlerts } from './components';
import { ProfitLossBody } from './ProfitLossBody';

/**
 * Profit/Loss financial statement sheet.
 */
function ProfitLossSheet({
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
      <ProfitLossSheetLoadingBar />
      {/* <ProfitLossSheetAlerts /> */}

      <DashboardPageContent>
        <ProfitLossSheetHeader
          pageFilter={filter}
          onSubmitFilter={handleSubmitFilter}
        />
        <ProfitLossBody />
      </DashboardPageContent>
    </ProfitLossSheetProvider>
  );
}

export default compose(
  withDashboardActions,
  withProfitLossActions,
)(ProfitLossSheet);
