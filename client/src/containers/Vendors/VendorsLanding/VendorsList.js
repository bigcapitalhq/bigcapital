import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';

import 'style/pages/Vendors/List.scss';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';

import { VendorsListProvider } from './VendorsListProvider';
import VendorActionsBar from './VendorActionsBar';
import VendorViewsTabs from './VendorViewsTabs';
import VendorsAlerts from '../VendorsAlerts';
import VendorsTable from './VendorsTable';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withVendors from './withVendors';

import { transformTableStateToQuery, compose } from 'utils';

/**
 * Vendors list page.
 */
function VendorsList({
  // #withDashboardActions
  changePageTitle,

  // #withVendors
  vendorsTableState,
}) {
  const { formatMessage } = useIntl();

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'vendors_list' }));
  }, [changePageTitle, formatMessage]);

  return (
    <VendorsListProvider query={transformTableStateToQuery(vendorsTableState)}>
      <VendorActionsBar />

      <DashboardPageContent>
        <VendorViewsTabs />
        <VendorsTable />
        <VendorsAlerts />
      </DashboardPageContent>
    </VendorsListProvider>
  );
}

export default compose(
  withDashboardActions,
  withVendors(({ vendorsTableState }) => ({ vendorsTableState })),
)(VendorsList);
