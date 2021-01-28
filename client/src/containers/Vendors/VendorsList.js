import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { FormattedMessage as T, useIntl } from 'react-intl';

import DashboardInsider from 'components/Dashboard/DashboardInsider';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';

import VendorActionsBar from 'containers/Vendors/VendorActionsBar';
import VendorsViewPage from 'containers/Vendors/VendorsViewPage';
import VendorsAlerts from 'containers/Vendors/VendorsAlerts';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withResourceActions from 'containers/Resources/withResourcesActions';
import withViewsActions from 'containers/Views/withViewsActions';
import withVendors from 'containers/Vendors/withVendors';
import withVendorActions from 'containers/Vendors/withVendorActions';

import { compose } from 'utils';

function VendorsList({
  // #withDashboardActions
  changePageTitle,

  // #withResourceActions
  requestFetchResourceViews,

  // #withVendors
  vendorTableQuery,

  // #withVendorActions
  requestFetchVendorsTable,
}) {
  const [tableLoading, setTableLoading] = useState(false);

  const { formatMessage } = useIntl();

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'vendors_list' }));
  }, [changePageTitle, formatMessage]);

  // Fetch vendors resource views and fields.
  const fetchResourceViews = useQuery(
    ['resource-views', 'vendors'],
    (key, resourceName) => requestFetchResourceViews(resourceName),
  );

  // Handle fetch vendors data table
  const fetchVendors = useQuery(
    ['vendors-table', vendorTableQuery],
    (key, query) => requestFetchVendorsTable({ ...query }),
  );

  useEffect(() => {
    if (tableLoading && !fetchVendors.isFetching) {
      setTableLoading(false);
    }
  }, [tableLoading, fetchVendors.isFetching]);

  return (
    <DashboardInsider
      loading={fetchResourceViews.isFetching}
      name={'customers-list'}
    >
      <VendorActionsBar />
      <DashboardPageContent>
        <VendorsViewPage />
        <VendorsAlerts />
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export default compose(
  withResourceActions,
  withVendorActions,
  withDashboardActions,
  withViewsActions,
  withVendors(({ vendorTableQuery }) => ({ vendorTableQuery })),
)(VendorsList);
