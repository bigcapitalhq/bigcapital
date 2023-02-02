// @ts-nocheck
import React, { useState, useCallback, useEffect } from 'react';
import moment from 'moment';

import { getDefaultAPAgingSummaryQuery } from './common';
import { FinancialStatement, DashboardPageContent } from '@/components';

import APAgingSummaryHeader from './APAgingSummaryHeader';
import APAgingSummaryActionsBar from './APAgingSummaryActionsBar';

import { APAgingSummaryBody } from './APAgingSummaryBody';
import { APAgingSummaryProvider } from './APAgingSummaryProvider';
import { APAgingSummarySheetLoadingBar } from './components';

import withAPAgingSummaryActions from './withAPAgingSummaryActions';

import { compose } from '@/utils';

/**
 * A/P aging summary report.
 */
function APAgingSummary({
  // #withSettings
  organizationName,

  // #withAPAgingSummaryActions
  toggleAPAgingSummaryFilterDrawer: toggleDisplayFilterDrawer,
}) {
  const [filter, setFilter] = useState({
    ...getDefaultAPAgingSummaryQuery(),
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
    setFilter({
      ...filter,
      numberFormat,
    });
  };
  // Hide the report filter drawer once the page unmount.
  useEffect(
    () => () => {
      toggleDisplayFilterDrawer(false);
    },
    [toggleDisplayFilterDrawer],
  );

  return (
    <APAgingSummaryProvider filter={filter}>
      <APAgingSummaryActionsBar
        numberFormat={filter.numberFormat}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
      <APAgingSummarySheetLoadingBar />

      <DashboardPageContent>
        <FinancialStatement name={'AP-aging-summary'}>
          <APAgingSummaryHeader
            pageFilter={filter}
            onSubmitFilter={handleFilterSubmit}
          />
          <APAgingSummaryBody organizationName={organizationName} />
        </FinancialStatement>
      </DashboardPageContent>
    </APAgingSummaryProvider>
  );
}

export default compose(withAPAgingSummaryActions)(APAgingSummary);
