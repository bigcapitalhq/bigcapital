import React, { useEffect, useState } from 'react';
import moment from 'moment';

import { FinancialStatement } from '@/components';
import DashboardPageContent from '@/components/Dashboard/DashboardPageContent';

import VendorsBalanceSummaryActionsBar from './VendorsBalanceSummaryActionsBar';
import VendorsBalanceSummaryHeader from './VendorsBalanceSummaryHeader';

import { VendorsBalanceSummaryProvider } from './VendorsBalanceSummaryProvider';
import { VendorsSummarySheetLoadingBar } from './components';
import { VendorBalanceSummaryBody } from './VendorsBalanceSummaryBody';

import withVendorsBalanceSummaryActions from './withVendorsBalanceSummaryActions';

import { TableStyle } from '@/common';
import { getDefaultVendorsBalanceQuery } from './utils';
import { compose } from '@/utils';

/**
 * Vendors Balance summary.
 */
function VendorsBalanceSummary({
  // #withVendorsBalanceSummaryActions
  toggleVendorSummaryFilterDrawer,
}) {
  const [filter, setFilter] = useState({
    ...getDefaultVendorsBalanceQuery(),
  });

  // Handle refetch vendors balance summary.
  const handleFilterSubmit = (filter) => {
    const _filter = {
      ...filter,
      asDate: moment(filter.asDate).format('YYYY-MM-DD'),
    };
    setFilter(_filter);
  };

  // Handle number format submit.
  const handleNumberFormatSubmit = (format) => {
    setFilter({
      ...filter,
      numberFormat: format,
    });
  };

  useEffect(
    () => () => {
      toggleVendorSummaryFilterDrawer(false);
    },
    [toggleVendorSummaryFilterDrawer],
  );

  return (
    <VendorsBalanceSummaryProvider filter={filter}>
      <VendorsBalanceSummaryActionsBar
        numberFormat={filter?.numberFormat}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
      <VendorsSummarySheetLoadingBar />

      <DashboardPageContent>
        <FinancialStatement>
          <VendorsBalanceSummaryHeader
            pageFilter={filter}
            onSubmitFilter={handleFilterSubmit}
          />
          <VendorBalanceSummaryBody />
        </FinancialStatement>
      </DashboardPageContent>
    </VendorsBalanceSummaryProvider>
  );
}

export default compose(withVendorsBalanceSummaryActions)(VendorsBalanceSummary);
