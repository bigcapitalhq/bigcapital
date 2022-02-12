import React, { useState, useCallback, useEffect } from 'react';
import moment from 'moment';

// import 'style/pages/FinancialStatements/ARAgingSummary.scss';

import { FinancialStatement } from 'components';

import ARAgingSummaryHeader from './ARAgingSummaryHeader';
import ARAgingSummaryActionsBar from './ARAgingSummaryActionsBar';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import { ARAgingSummaryProvider } from './ARAgingSummaryProvider';
import { ARAgingSummarySheetLoadingBar } from './components';
import { ARAgingSummaryBody } from './ARAgingSummaryBody';

import withARAgingSummaryActions from './withARAgingSummaryActions';

import { getDefaultARAgingSummaryQuery } from './common';
import { compose } from 'utils';

/**
 * A/R aging summary report.
 */
function ReceivableAgingSummarySheet({
  // #withARAgingSummaryActions
  toggleARAgingSummaryFilterDrawer: toggleDisplayFilterDrawer,
}) {
  const [filter, setFilter] = useState({
    ...getDefaultARAgingSummaryQuery(),
  });

  // Handle filter submit.
  const handleFilterSubmit = useCallback((filter) => {
    const _filter = {
      ...filter,
      asDate: moment(filter.asDate).format('YYYY-MM-DD'),
    };
    setFilter(_filter);
  }, []);

  // Handle number format submit.
  const handleNumberFormatSubmit = (numberFormat) => {
    setFilter({ ...filter, numberFormat });
  };
  // Hide the filter drawer once the page unmount.
  useEffect(
    () => () => {
      toggleDisplayFilterDrawer(false);
    },
    [toggleDisplayFilterDrawer],
  );

  return (
    <ARAgingSummaryProvider filter={filter}>
      <ARAgingSummaryActionsBar
        numberFormat={filter.numberFormat}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
      <ARAgingSummarySheetLoadingBar />

      <DashboardPageContent>
        <FinancialStatement name={'AR-aging-summary'}>
          <ARAgingSummaryHeader
            pageFilter={filter}
            onSubmitFilter={handleFilterSubmit}
          />
          <ARAgingSummaryBody />
        </FinancialStatement>
      </DashboardPageContent>
    </ARAgingSummaryProvider>
  );
}

export default compose(withARAgingSummaryActions)(ReceivableAgingSummarySheet);
