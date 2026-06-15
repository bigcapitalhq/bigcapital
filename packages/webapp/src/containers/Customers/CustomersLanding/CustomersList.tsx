// @ts-nocheck
import React, { useEffect } from 'react';

import '@/style/pages/Customers/List.scss';

import { DashboardPageContent } from '@/components';

import { CustomersActionsBar } from './CustomersActionsBar';
import { CustomersTable } from './CustomersTable';
import { CustomersListProvider } from './CustomersListProvider';

import { withCustomers } from './withCustomers';
import { withCustomersActions } from './withCustomersActions';
import { flow } from 'fp-ts/function';

/**
 * Customers list.
 */
function CustomersListInner({
  // #withCustomers
  customersTableState,
  customersTableStateChanged,

  // #withCustomersActions
  resetCustomersTableState,
  resetCustomersSelectedRows,
}) {
  // Resets the accounts table state once the page unmount.
  useEffect(
    () => () => {
      resetCustomersTableState();
      resetCustomersSelectedRows();
    },
    [resetCustomersSelectedRows, resetCustomersTableState],
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

export const CustomersList = flow(
  withCustomersActions,
  withCustomers(({ customersTableState, customersTableStateChanged }) => ({
    customersTableState,
    customersTableStateChanged,
  })),
)(CustomersListInner);
