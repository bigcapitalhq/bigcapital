// @ts-nocheck
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import * as R from 'ramda';

import { FinancialStatement, DashboardPageContent } from '@/components';

import CustomersBalanceSummaryActionsBar from './CustomersBalanceSummaryActionsBar';
import CustomersBalanceSummaryHeader from './CustomersBalanceSummaryHeader';

import { CustomerBalanceSummaryBody } from './CustomerBalanceSummaryBody';
import { CustomersBalanceSummaryProvider } from './CustomersBalanceSummaryProvider';
import { getDefaultCustomersBalanceQuery } from './utils';
import { CustomersBalanceLoadingBar } from './components';
import withCustomersBalanceSummaryActions from './withCustomersBalanceSummaryActions';


/**
 * Customers Balance summary.
 */
function CustomersBalanceSummary({
  // #withCustomersBalanceSummaryActions
  toggleCustomerBalanceFilterDrawer,
}) {
  const [filter, setFilter] = useState({
    ...getDefaultCustomersBalanceQuery(),
  });
  // Handle re-fetch customers balance summary after filter change.
  const handleFilterSubmit = (filter) => {
    const _filter = {
      ...filter,
      asDate: moment(filter.asDate).format('YYYY-MM-DD'),
    };
    setFilter({ ..._filter });
  };
  // Handle number format.
  const handleNumberFormat = (values) => {
    setFilter({
      ...filter,
      numberFormat: values,
    });
  };

  useEffect(
    () => () => {
      toggleCustomerBalanceFilterDrawer(false);
    },
    [toggleCustomerBalanceFilterDrawer],
  );

  return (
    <CustomersBalanceSummaryProvider filter={filter}>
      <CustomersBalanceSummaryActionsBar
        numberFormat={filter?.numberFormat}
        onNumberFormatSubmit={handleNumberFormat}
      />
      <CustomersBalanceLoadingBar />

      <DashboardPageContent>
        <FinancialStatement>
          <CustomersBalanceSummaryHeader
            pageFilter={filter}
            onSubmitFilter={handleFilterSubmit}
          />
          <CustomerBalanceSummaryBody />
        </FinancialStatement>
      </DashboardPageContent>
    </CustomersBalanceSummaryProvider>
  );
}
export default R.compose(withCustomersBalanceSummaryActions)(
  CustomersBalanceSummary,
);
