import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { FormattedMessage as T, useIntl } from 'react-intl';

import DashboardInsider from 'components/Dashboard/DashboardInsider';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';

import CustomerActionsBar from 'containers/Customers/CustomerActionsBar';
import CustomersAlerts from 'containers/Customers/CustomersAlerts';
import CustomersViewPage from 'containers/Customers/CustomersViewPage';
import withCustomers from 'containers/Customers/withCustomers';
import withCustomersActions from 'containers/Customers/withCustomersActions';
import withResourceActions from 'containers/Resources/withResourcesActions';
import withViewsActions from 'containers/Views/withViewsActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import { compose } from 'utils';

import 'style/pages/Customers/List.scss';

/**
 * Customers list.
 */
function CustomersList({
  // #withDashboardActions
  changePageTitle,

  // #withResourceActions
  requestFetchResourceViews,

  // #withCustomers
  customersTableQuery,

  // #withAlertsActions.
  openAlert,

  // #withCustomersActions
  requestFetchCustomers,

  addCustomersTableQueries,
}) {
  const [tableLoading, setTableLoading] = useState(false);
  const { formatMessage } = useIntl();

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'customers_list' }));
  }, [changePageTitle, formatMessage]);

  // Fetch customers resource views and fields.
  const fetchResourceViews = useQuery(
    ['resource-views', 'customers'],
    (key, resourceName) => requestFetchResourceViews(resourceName),
  );

  const fetchCustomers = useQuery(
    ['customers-table', customersTableQuery],
    (key, query) => requestFetchCustomers({ ...query }),
  );

  useEffect(() => {
    if (tableLoading && !fetchCustomers.isFetching) {
      setTableLoading(false);
    }
  }, [tableLoading, fetchCustomers.isFetching]);

  return (
    <DashboardInsider
      loading={fetchResourceViews.isFetching}
      name={'customers-list'}
    >
      <CustomerActionsBar />

      <DashboardPageContent>
        <CustomersViewPage />
      </DashboardPageContent>
      <CustomersAlerts />
    </DashboardInsider>
  );
}

export default compose(
  withResourceActions,
  withCustomersActions,
  withDashboardActions,
  withViewsActions,
  withCustomers(({ customersTableQuery }) => ({ customersTableQuery })),
)(CustomersList);
