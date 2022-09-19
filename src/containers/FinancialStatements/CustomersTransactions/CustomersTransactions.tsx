// @ts-nocheck
import React, { useEffect, useState } from 'react';
import moment from 'moment';

import { FinancialStatement, DashboardPageContent } from '@/components';

import CustomersTransactionsHeader from './CustomersTransactionsHeader';
import CustomersTransactionsActionsBar from './CustomersTransactionsActionsBar';

import withCustomersTransactionsActions from './withCustomersTransactionsActions';
import { CustomersTransactionsLoadingBar } from './components';
import { CustomersTransactionsBody } from './CustomersTransactionsBody';
import { CustomersTransactionsProvider } from './CustomersTransactionsProvider';

import { compose } from '@/utils';

/**
 * Customers transactions.
 */
function CustomersTransactions({
  //#withCustomersTransactionsActions
  toggleCustomersTransactionsFilterDrawer,
}) {
  // filter
  const [filter, setFilter] = useState({
    fromDate: moment().startOf('year').format('YYYY-MM-DD'),
    toDate: moment().endOf('year').format('YYYY-MM-DD'),
    filterByOption: 'with-transactions',
  });

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
      toggleCustomersTransactionsFilterDrawer(false);
    },
    [toggleCustomersTransactionsFilterDrawer],
  );

  return (
    <CustomersTransactionsProvider filter={filter}>
      <CustomersTransactionsActionsBar
        numberFormat={filter.numberFormat}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
      <CustomersTransactionsLoadingBar />
      <DashboardPageContent>
        <FinancialStatement>
          <CustomersTransactionsHeader
            pageFilter={filter}
            onSubmitFilter={handleFilterSubmit}
          />
          <CustomersTransactionsBody />
        </FinancialStatement>
      </DashboardPageContent>
    </CustomersTransactionsProvider>
  );
}
export default compose(withCustomersTransactionsActions)(CustomersTransactions);
