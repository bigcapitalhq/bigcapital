import React from 'react';

import 'style/pages/Customers/List.scss';

import { DashboardContentTable, DashboardPageContent } from 'components';

import CustomersActionsBar from './CustomersActionsBar';
import CustomersViewsTabs from './CustomersViewsTabs';
import CustomersTable from './CustomersTable';
import CustomersAlerts from 'containers/Customers/CustomersAlerts';
import { CustomersListProvider } from './CustomersListProvider';

import withCustomers from './withCustomers';
import { transformTableStateToQuery, compose } from 'utils';

/**
 * Customers list.
 */
function CustomersList({
  // #withCustomers
  customersTableState,
}) {
  return (
    <CustomersListProvider
      query={transformTableStateToQuery(customersTableState)}
    >
      <CustomersActionsBar />

      <DashboardPageContent>
        <CustomersViewsTabs />

        <DashboardContentTable>
          <CustomersTable />
        </DashboardContentTable>
      </DashboardPageContent>
      <CustomersAlerts />
    </CustomersListProvider>
  );
}

export default compose(
  withCustomers(({ customersTableState }) => ({ customersTableState })),
)(CustomersList);
