import moment from 'moment';
import React, { useEffect } from 'react';
import { VendorsSummarySheetLoadingBar } from './components';
import { useVendorsBalanceSummaryQuery } from './utils';
import { VendorBalanceDialogs } from './VendorBalanceDialogs';
import { VendorsBalanceSummaryActionsBar } from './VendorsBalanceSummaryActionsBar';
import { VendorBalanceSummaryBody } from './VendorsBalanceSummaryBody';
import { VendorsBalanceSummaryHeader } from './VendorsBalanceSummaryHeader';
import { VendorsBalanceSummaryProvider } from './VendorsBalanceSummaryProvider';
import {
  withVendorsBalanceSummaryActions,
  WithVendorsBalanceSummaryActionsProps,
} from './withVendorsBalanceSummaryActions';
import { FinancialStatement, DashboardPageContent } from '@/components';
import { compose } from '@/utils';

interface VendorsBalanceSummaryProps {
  toggleVendorSummaryFilterDrawer: WithVendorsBalanceSummaryActionsProps['toggleVendorSummaryFilterDrawer'];
}

/**
 * Vendors Balance summary.
 */
function VendorsBalanceSummaryInner({
  // #withVendorsBalanceSummaryActions
  toggleVendorSummaryFilterDrawer,
}: VendorsBalanceSummaryProps) {
  const { query, setLocationQuery } = useVendorsBalanceSummaryQuery();

  // Handle refetch vendors balance summary.
  const handleFilterSubmit = (filter: Record<string, unknown>) => {
    const _filter = {
      ...filter,
      asDate: moment(filter.asDate as string).format('YYYY-MM-DD'),
    };
    setLocationQuery(_filter);
  };

  // Handle number format submit.
  const handleNumberFormatSubmit = (format: Record<string, unknown>) => {
    setLocationQuery({
      ...query,
      numberFormat: format,
    });
  };

  useEffect(
    () => () => toggleVendorSummaryFilterDrawer(false),
    [toggleVendorSummaryFilterDrawer],
  );

  return (
    <VendorsBalanceSummaryProvider filter={query}>
      <VendorsBalanceSummaryActionsBar
        numberFormat={query?.numberFormat as Record<string, unknown>}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
      <VendorsSummarySheetLoadingBar />

      <DashboardPageContent>
        <FinancialStatement>
          <VendorsBalanceSummaryHeader
            pageFilter={query}
            onSubmitFilter={handleFilterSubmit}
          />
          <VendorBalanceSummaryBody />
        </FinancialStatement>
      </DashboardPageContent>

      <VendorBalanceDialogs />
    </VendorsBalanceSummaryProvider>
  );
}

export const VendorsBalanceSummary = compose(withVendorsBalanceSummaryActions)(
  VendorsBalanceSummaryInner,
);
