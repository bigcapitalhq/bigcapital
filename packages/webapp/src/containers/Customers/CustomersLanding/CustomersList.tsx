// @ts-nocheck
import React, { useEffect } from 'react';

import '@/style/pages/Customers/List.scss';

import { DashboardPageContent } from '@/components';

import CustomersActionsBar from './CustomersActionsBar';
import CustomersTable from './CustomersTable';
import { CustomersListProvider } from './CustomersListProvider';

import withCustomers from './withCustomers';
import withCustomersActions from './withCustomersActions';

import { compose } from '@/utils';

/**
 * Customers list.
 */
function CustomersList({
  // #withCustomers
  customersTableState,
  customersTableStateChanged,

  // #withCustomersActions
  resetCustomersTableState,
}) {
  // Resets the accounts table state once the page unmount.
  useEffect(
    () => () => {
      resetCustomersTableState();
    },
    [resetCustomersTableState],
  );

  return (
    <CustomersListProvider
      tableState={customersTableState}
      tableStateChanged={customersTableStateChanged}
    >
      <CustomersActionsBar />

      <DashboardPageContent>
        <CustomersTable />
      </DashboardPageContent>
    </CustomersListProvider>
  );
}

export default compose(
  withCustomers(({ customersTableState, customersTableStateChanged }) => ({
    customersTableState,
    customersTableStateChanged,
  })),
  withCustomersActions,
)(CustomersList);
