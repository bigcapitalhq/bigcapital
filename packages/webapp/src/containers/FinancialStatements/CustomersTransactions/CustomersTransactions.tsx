import React, { useEffect } from 'react';
import moment from 'moment';

import { FinancialStatement, DashboardPageContent } from '@/components';

import { CustomersTransactionsHeader } from './CustomersTransactionsHeader';
import { CustomersTransactionsActionsBar } from './CustomersTransactionsActionsBar';

import {
  withCustomersTransactionsActions,
  WithCustomersTransactionsActionsProps,
} from './withCustomersTransactionsActions';
import { CustomersTransactionsLoadingBar } from './components';
import { CustomersTransactionsBody } from './CustomersTransactionsBody';
import { CustomersTransactionsProvider } from './CustomersTransactionsProvider';

import { useCustomersTransactionsQuery } from './_utils';
import { CustomersTransactionsDialogs } from './CustomersTransactionsDialogs';
import { flow } from 'fp-ts/function';

interface CustomersTransactionsProps
  extends WithCustomersTransactionsActionsProps {}

/**
 * Customers transactions.
 */
function CustomersTransactionsInner({
  //#withCustomersTransactionsActions
  toggleCustomersTransactionsFilterDrawer,
}: CustomersTransactionsProps) {
  // filter
  const [filter, setFilter] = useCustomersTransactionsQuery();

  const handleFilterSubmit = (filter: Record<string, any>) => {
    const _filter = {
      ...filter,
      fromDate: moment(filter.fromDate).format('YYYY-MM-DD'),
      toDate: moment(filter.toDate).format('YYYY-MM-DD'),
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

      <CustomersTransactionsDialogs />
    </CustomersTransactionsProvider>
  );
}
export const CustomersTransactions = flow(
  withCustomersTransactionsActions,
)(CustomersTransactionsInner);
