import React, { useEffect } from 'react';
import moment from 'moment';
import * as R from 'ramda';
import { FinancialStatement, DashboardPageContent } from '@/components';
import { CustomersBalanceSummaryActionsBar } from './CustomersBalanceSummaryActionsBar';
import { CustomersBalanceSummaryHeader } from './CustomersBalanceSummaryHeader';
import { CustomerBalanceSummaryBody } from './CustomerBalanceSummaryBody';
import { CustomersBalanceSummaryProvider } from './CustomersBalanceSummaryProvider';
import { useCustomerBalanceSummaryQuery } from './utils';
import { CustomersBalanceLoadingBar } from './components';
import {
  withCustomersBalanceSummaryActions,
  WithCustomersBalanceSummaryActionsProps,
} from './withCustomersBalanceSummaryActions';
import { CustomerBalanceSummaryPdfDialog } from './CustomerBalancePdfDialog';
import { DialogsName } from '@/constants/dialogs';
import { flow } from 'fp-ts/function';

type CustomersBalanceSummaryProps = Pick<
  WithCustomersBalanceSummaryActionsProps,
  'toggleCustomerBalanceFilterDrawer'
>;

function CustomersBalanceSummaryInner({
  toggleCustomerBalanceFilterDrawer,
}: CustomersBalanceSummaryProps) {
  const { query, setLocationQuery } = useCustomerBalanceSummaryQuery();

  const handleFilterSubmit = (filter: Record<string, unknown>) => {
    const _filter = {
      ...filter,
      asDate: moment(filter.asDate as string).format('YYYY-MM-DD'),
    };
    setLocationQuery({ ..._filter });
  };

  const handleNumberFormat = (values: Record<string, unknown>) => {
    setLocationQuery({
      ...query,
      numberFormat: values,
    });
  };

  useEffect(
    () => () => toggleCustomerBalanceFilterDrawer(false),
    [toggleCustomerBalanceFilterDrawer],
  );

  return (
    <CustomersBalanceSummaryProvider filter={query}>
      <CustomersBalanceSummaryActionsBar
        numberFormat={query?.numberFormat}
        onNumberFormatSubmit={handleNumberFormat}
      />
      <CustomersBalanceLoadingBar />

      <DashboardPageContent>
        <FinancialStatement>
          <CustomersBalanceSummaryHeader
            pageFilter={query}
            onSubmitFilter={handleFilterSubmit}
          />
          <CustomerBalanceSummaryBody />
        </FinancialStatement>
      </DashboardPageContent>

      <CustomerBalanceSummaryPdfDialog
        dialogName={DialogsName.CustomerBalanceSummaryPdfPreview}
      />
    </CustomersBalanceSummaryProvider>
  );
}

export const CustomersBalanceSummary = flow(
  withCustomersBalanceSummaryActions,
)(CustomersBalanceSummaryInner);
