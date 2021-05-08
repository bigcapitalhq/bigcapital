import React, { useEffect, useState } from 'react';
import moment from 'moment';
import 'style/pages/FinancialStatements/ContactsTransactions.scss';

import { FinancialStatement } from 'components';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';

import CustomersTransactionsHeader from './CustomersTransactionsHeader';
import CustomersTransactionsTable from './CustomersTransactionsTable';
import CustomersTranscationsActionsBar from './CustomersTranscationsActionsBar';

import withCustomersTransactionsActions from './withCustomersTransactionsActions';
import withSettings from 'containers/Settings/withSettings';
import { CustomersTranscationsLoadingBar } from './components';
import { CustomersTranscationsProvider } from './CustomersTranscationsProvider';

import { compose } from 'utils';

/**
 * Customers transactions.
 */
function CustomersTransactions({
  // #withPreferences
  organizationName,

  //#withCustomersTransactionsActions
  toggleCustomersTransactionsFilterDrawer,
}) {
  // filter
  const [filter, setFilter] = useState({
    fromDate: moment().startOf('year').format('YYYY-MM-DD'),
    toDate: moment().endOf('year').format('YYYY-MM-DD'),
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
    <CustomersTranscationsProvider filter={filter}>
      <CustomersTranscationsActionsBar
        numberFormat={filter.numberFormat}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
      <CustomersTranscationsLoadingBar />
      <DashboardPageContent>
        <FinancialStatement>
          <div className={'financial-statement--transactions'}>
            <CustomersTransactionsHeader
              pageFilter={filter}
              onSubmitFilter={handleFilterSubmit}
            />

            <div class="financial-statement__body">
              <CustomersTransactionsTable companyName={organizationName} />
            </div>
          </div>
        </FinancialStatement>
      </DashboardPageContent>
    </CustomersTranscationsProvider>
  );
}
export default compose(
  withSettings(({ organizationSettings }) => ({
    organizationName: organizationSettings.name,
  })),
  withCustomersTransactionsActions,
)(CustomersTransactions);
