import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';

import { VendorsListProvider } from './VendorsListProvider';
import VendorActionsBar from 'containers/Vendors/VendorActionsBar';
import VendorsViewPage from 'containers/Vendors/VendorsViewPage';
import VendorsAlerts from 'containers/Vendors/VendorsAlerts';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withVendors from 'containers/Vendors/withVendors';

import { compose } from 'utils';

/**
 * Vendors list page.
 */
function VendorsList({
  // #withDashboardActions
  changePageTitle,

  // #withVendors
  vendorTableQuery,
}) {
  const { formatMessage } = useIntl();

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'vendors_list' }));
  }, [changePageTitle, formatMessage]);

  return (
    <VendorsListProvider query={vendorTableQuery}>
      <VendorActionsBar />

      <DashboardPageContent>
        <VendorsViewPage /> 
        {/* <VendorsAlerts /> */}
      </DashboardPageContent>
    </VendorsListProvider>
  );
}

export default compose(
  withDashboardActions,
  withVendors(({ vendorTableQuery }) => ({ vendorTableQuery })),
)(VendorsList);
