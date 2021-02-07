import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';

import CustomerActionsBar from 'containers/Customers/CustomerActionsBar';
import CustomersAlerts from 'containers/Customers/CustomersAlerts';
import CustomersViewPage from 'containers/Customers/CustomersViewPage';
import { CustomersListProvider } from './CustomersListProvider';

import withCustomers from 'containers/Customers/withCustomers';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import { compose } from 'utils';

import 'style/pages/Customers/List.scss';

/**
 * Customers list.
 */
function CustomersList({
  // #withDashboardActions
  changePageTitle,

  // #withCustomers
  customersTableQuery,
}) {
  const { formatMessage } = useIntl();

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'customers_list' }));
  }, [changePageTitle, formatMessage]);


  return (
    <CustomersListProvider query={customersTableQuery}>
      <CustomerActionsBar />

      <DashboardPageContent>
        <CustomersViewPage />
      </DashboardPageContent>
      <CustomersAlerts />
    </CustomersListProvider>
  );
}

export default compose(
  withDashboardActions,
  withCustomers(({ customersTableQuery }) => ({ customersTableQuery })),
)(CustomersList);
