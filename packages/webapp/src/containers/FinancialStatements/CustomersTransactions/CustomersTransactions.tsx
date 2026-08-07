import moment from 'moment';
import React, { useEffect } from 'react';
import { useCustomersTransactionsQuery } from './_utils';
import { CustomersTransactionsLoadingBar } from './components';
import { CustomersTransactionsActionsBar } from './CustomersTransactionsActionsBar';
import { CustomersTransactionsBody } from './CustomersTransactionsBody';
import { CustomersTransactionsDialogs } from './CustomersTransactionsDialogs';
import { CustomersTransactionsHeader } from './CustomersTransactionsHeader';
import { CustomersTransactionsProvider } from './CustomersTransactionsProvider';
import {
  withCustomersTransactionsActions,
  WithCustomersTransactionsActionsProps,
} from './withCustomersTransactionsActions';
import { FinancialStatement, DashboardPageContent } from '@/components';
import { compose } from '@/utils';

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
export const CustomersTransactions = compose(withCustomersTransactionsActions)(
  CustomersTransactionsInner,
);
