import React, { useEffect, useState } from 'react';
import moment from 'moment';

import 'style/pages/FinancialStatements/ContactsBalanceSummary.scss';

import { FinancialStatement } from 'components';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';

import CustomersBalanceSummaryActionsBar from './CustomersBalanceSummaryActionsBar';
import CustomersBalanceSummaryHeader from './CustomersBalanceSummaryHeader';
import CustomersBalanceSummaryTable from './CustomersBalanceSummaryTable';

import { CustomersBalanceLoadingBar } from './components';
import { CustomersBalanceSummaryProvider } from './CustomersBalanceSummaryProvider';
import withCustomersBalanceSummaryActions from './withCustomersBalanceSummaryActions';

import withSettings from 'containers/Settings/withSettings';

import { compose } from 'redux';

/**
 * Customers Balance summary.
 */
function CustomersBalanceSummary({
  // #withPreferences
  organizationName,

  // #withCustomersBalanceSummaryActions
  toggleCustomerBalanceFilterDrawer,
}) {

  const [filter, setFilter] = useState({
    asDate: moment().endOf('day').format('YYYY-MM-DD'),
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
          <div className="financial-statement__body">
            <CustomersBalanceSummaryTable companyName={organizationName} />
          </div>
        </FinancialStatement>
      </DashboardPageContent>
    </CustomersBalanceSummaryProvider>
  );
}
export default compose(
  withSettings(({ organizationSettings }) => ({
    organizationName: organizationSettings.name,
  })),
  withCustomersBalanceSummaryActions,
)(CustomersBalanceSummary);
