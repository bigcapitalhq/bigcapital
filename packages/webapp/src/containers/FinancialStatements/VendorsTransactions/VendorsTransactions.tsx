import moment from 'moment';
import React, { useEffect } from 'react';
import { useVendorsTransactionsQuery } from './_utils';
import { VendorsTransactionsLoadingBar } from './components';
import { VendorsTransactionsActionsBar } from './VendorsTransactionsActionsBar';
import { VendorsTransactionsBody } from './VendorsTransactionsBody';
import { VendorsTransactionsHeader } from './VendorsTransactionsHeader';
import { VendorsTransactionsProvider } from './VendorsTransactionsProvider';
import { VendorTransactionsDialogs } from './VendorTransactionsDialogs';
import {
  withVendorsTransactionsActions,
  WithVendorsTransactionsActionsProps,
} from './withVendorsTransactionsActions';
import { FinancialStatement, DashboardPageContent } from '@/components';
import { compose } from '@/utils';

interface VendorsTransactionsProps {
  toggleVendorsTransactionsFilterDrawer: WithVendorsTransactionsActionsProps['toggleVendorsTransactionsFilterDrawer'];
}

/**
 * Vendors transactions.
 */
function VendorsTransactionsInner({
  //#withVendorsTransactionsActions
  toggleVendorsTransactionsFilterDrawer,
}: VendorsTransactionsProps) {
  // filter
  const [filter, setFilter] = useVendorsTransactionsQuery();

  const handleFilterSubmit = (filter: Record<string, unknown>) => {
    const _filter = {
      ...filter,
      fromDate: moment(filter.fromDate as string).format('YYYY-MM-DD'),
      toDate: moment(filter.toDate as string).format('YYYY-MM-DD'),
    };
    setFilter({ ..._filter });
  };
  // Handle number format submit.
  const handleNumberFormatSubmit = (values: Record<string, unknown>) => {
    setFilter({
      ...filter,
      numberFormat: values,
    });
  };

  useEffect(
    () => () => {
      toggleVendorsTransactionsFilterDrawer(false);
    },
    [toggleVendorsTransactionsFilterDrawer],
  );

  return (
    <VendorsTransactionsProvider filter={filter}>
      <VendorsTransactionsActionsBar
        numberFormat={filter.numberFormat}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
      <VendorsTransactionsLoadingBar />
      <DashboardPageContent>
        <FinancialStatement>
          <VendorsTransactionsHeader
            pageFilter={filter}
            onSubmitFilter={handleFilterSubmit}
          />
          <VendorsTransactionsBody />
        </FinancialStatement>
      </DashboardPageContent>

      <VendorTransactionsDialogs />
    </VendorsTransactionsProvider>
  );
}
export const VendorsTransactions = compose(withVendorsTransactionsActions)(
  VendorsTransactionsInner,
);
