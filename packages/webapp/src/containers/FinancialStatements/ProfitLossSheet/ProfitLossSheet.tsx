// @ts-nocheck
import React from 'react';
import moment from 'moment';
import * as R from 'ramda';

import ProfitLossSheetHeader from './ProfitLossSheetHeader';
import ProfitLossActionsBar from './ProfitLossActionsBar';

import { DashboardPageContent } from '@/components';

import withDashboardActions from '@/containers/Dashboard/withDashboardActions';
import withProfitLossActions from './withProfitLossActions';

import { useProfitLossSheetQuery } from './utils';
import { ProfitLossSheetProvider } from './ProfitLossProvider';
import { ProfitLossSheetAlerts, ProfitLossSheetLoadingBar } from './components';
import { ProfitLossBody } from './ProfitLossBody';
import { ProfitLossSheetDialogs } from './ProfitLossSheetDialogs';

/**
 * Profit/Loss financial statement sheet.
 * @returns {React.JSX}
 */
function ProfitLossSheet({
  // #withProfitLossActions
  toggleProfitLossFilterDrawer: toggleDisplayFilterDrawer,
}) {
  // Profit/loss sheet query.
  const { query, setLocationQuery } = useProfitLossSheetQuery();

  // Handle submit filter.
  const handleSubmitFilter = (filter) => {
    const newFilter = {
      ...filter,
      fromDate: moment(filter.fromDate).format('YYYY-MM-DD'),
      toDate: moment(filter.toDate).format('YYYY-MM-DD'),
    };
    setLocationQuery(newFilter);
  };
  // Handle number format submit.
  const handleNumberFormatSubmit = (numberFormat) => {
    setLocationQuery({
      ...query,
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
    <ProfitLossSheetProvider query={query}>
      <ProfitLossActionsBar
        numberFormat={query.numberFormat}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
      <ProfitLossSheetLoadingBar />
      <ProfitLossSheetAlerts />

      <DashboardPageContent>
        <ProfitLossSheetHeader
          pageFilter={query}
          onSubmitFilter={handleSubmitFilter}
        />
        <ProfitLossBody />
      </DashboardPageContent>

      <ProfitLossSheetDialogs />
    </ProfitLossSheetProvider>
  );
}

export default R.compose(
  withDashboardActions,
  withProfitLossActions,
)(ProfitLossSheet);
