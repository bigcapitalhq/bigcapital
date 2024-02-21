// @ts-nocheck
import React, { useEffect, useState } from 'react';
import moment from 'moment';

import { FinancialStatement, DashboardPageContent } from '@/components';
import { VendorsTransactionsBody } from './VendorsTransactionsBody';
import { VendorsTransactionsProvider } from './VendorsTransactionsProvider';
import { VendorsTransactionsLoadingBar } from './components';

import VendorsTransactionsHeader from './VendorsTransactionsHeader';
import VendorsTransactionsActionsBar from './VendorsTransactionsActionsBar';

import withVendorsTransactionsActions from './withVendorsTransactionsActions';

import { compose } from '@/utils';
import { useVendorsTransactionsQuery } from './_utils';
import { VendorTransactionsDialogs } from './VendorTransactionsDialogs';

/**
 * Vendors transactions.
 */
function VendorsTransactions({
  //#withVendorsTransactionsActions
  toggleVendorsTransactionsFilterDrawer,
}) {
  // filter
  const [filter, setFilter] = useVendorsTransactionsQuery();

  const handleFilterSubmit = (filter) => {
    const _filter = {
      ...filter,
      fromDate: moment(filter.fromDate).format('YYYY-MM-DD'),
      toDate: moment(filter.toDate).format('YYYY-MM-DD'),
    };
    setFilter({ ..._filter });
  };

  // Handle number format submit.
  const handleNumberFormatSubmit = (values) => {
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
export default compose(withVendorsTransactionsActions)(VendorsTransactions);
