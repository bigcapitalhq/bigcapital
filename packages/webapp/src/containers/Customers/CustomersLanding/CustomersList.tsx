import { useEffect } from 'react';

import '@/style/pages/Customers/List.scss';

import { CustomersActionsBar } from './CustomersActionsBar';
import { CustomersListDialogs } from './CustomersListDialogs';
import { CustomersListProvider } from './CustomersListProvider';
import { CustomersTable } from './CustomersTable';
import { withCustomers } from './withCustomers';
import type { WithCustomersProps } from './withCustomers';
import { withCustomersActions } from './withCustomersActions';
import type { WithCustomersActionsProps } from './withCustomersActions';
import { DashboardPageContent } from '@/components';
import { compose } from '@/utils';

interface CustomersListInnerProps
  extends Pick<
      WithCustomersProps,
      'customersTableState' | 'customersTableStateChanged'
    >,
    WithCustomersActionsProps {}

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
}: CustomersListInnerProps) {
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
      <CustomersListDialogs />

      <DashboardPageContent>
        <CustomersTable />
      </DashboardPageContent>
    </CustomersListProvider>
  );
}

export const CustomersList = compose(
  withCustomers(({ customersTableState, customersTableStateChanged }) => ({
    customersTableState,
    customersTableStateChanged,
  })),
  withCustomersActions,
)(CustomersListInner);
