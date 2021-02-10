import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';

import 'style/pages/Customers/List.scss';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';

import CustomersActionsBar from './CustomersActionsBar';
import CustomersViewsTabs from './CustomersViewsTabs';
import CustomersTable from './CustomersTable';
import CustomersAlerts from 'containers/Customers/CustomersAlerts';
import { CustomersListProvider } from './CustomersListProvider';

import withCustomers from './withCustomers';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import { transformTableStateToQuery, compose } from 'utils';

/**
 * Customers list.
 */
function CustomersList({
  // #withDashboardActions
  changePageTitle,

  // #withCustomers
  customersTableState,
}) {
  const { formatMessage } = useIntl();

  // Changes the dashboard page title once the page mount.
  useEffect(() => {
    changePageTitle(formatMessage({ id: 'customers_list' }));
  }, [changePageTitle, formatMessage]);

  return (
    <CustomersListProvider
      query={transformTableStateToQuery(customersTableState)}
    >
      <CustomersActionsBar />

      <DashboardPageContent>
        <CustomersViewsTabs />
        <CustomersTable />
      </DashboardPageContent>
      <CustomersAlerts />
    </CustomersListProvider>
  );
}

export default compose(
  withDashboardActions,
  withCustomers(({ customersTableState }) => ({ customersTableState })),
)(CustomersList);
