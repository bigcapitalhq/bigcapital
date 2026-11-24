import * as FF from 'fp-ts/function';
import { useHistory } from 'react-router-dom';
import { ActionsMenu, useCustomersTableColumns } from './components';
import { CustomersEmptyStatus } from './CustomersEmptyStatus';
import { useCustomersListContext } from './CustomersListProvider';
import { withCustomers } from './withCustomers';
import { withCustomersActions } from './withCustomersActions';
import type { WithCustomersProps } from './withCustomers';
import type { WithCustomersActionsProps } from './withCustomersActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import type { Customer } from '@bigcapital/sdk-ts';
import { createDashboardListTable } from '@/components/Datatable/DashboardListTable';
import { DRAWERS } from '@/constants/drawers';
import { TABLES } from '@/constants/tables';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';

const Table = createDashboardListTable({
  tableName: TABLES.CUSTOMER,
  rowName: 'customer',
  identifierColumn: 'display_name',
  ActionsMenu,
});

interface CustomersTableInnerProps
  extends Pick<
      WithCustomersProps,
      'customersTableState' | 'customersSelectedRows'
    >,
    WithCustomersActionsProps,
    WithAlertActionsProps,
    WithDialogActionsProps,
    WithDrawerActionsProps {}

type CustomerRow = Pick<Customer, 'id'>;
/**
 * Customers table.
 */
function CustomersTableInner({
  // #withCustomersActions
  setCustomersTableState,
  setCustomersSelectedRows,

  // #withCustomers
  customersTableState,
  customersSelectedRows,

  // #withAlerts
  openAlert,

  // #withDrawerActions
  openDrawer,

  // #withDialogActions
  openDialog,
}: CustomersTableInnerProps) {
  const history = useHistory();

  // Customers list context.
  const {
    isEmptyStatus,
    customers,
    pagination,
    isCustomersLoading,
    isCustomersFetching,
    customersSettings,
  } = useCustomersListContext();
  const compact = customersSettings?.tableSize === 'small';
  const columns = useCustomersTableColumns(compact ? 'small' : 'medium');

  // Handles the customer delete action.
  const handleCustomerDelete = ({ id }: CustomerRow) => {
    openAlert('customer-delete', { contactId: id });
  };

  // Handle the customer edit action.
  const handleCustomerEdit = (customer: CustomerRow) => {
    history.push(`/customers/${customer.id}/edit`);
  };

  const handleContactDuplicate = ({ id }: CustomerRow) => {
    openDialog('contact-duplicate', { contactId: id });
  };

  // Handle cancel/confirm inactive.
  const handleInactiveCustomer = ({ id }: CustomerRow) => {
    openAlert('customer-inactivate', { customerId: id });
  };

  // Handle cancel/confirm activate.
  const handleActivateCustomer = ({ id }: CustomerRow) => {
    openAlert('customer-activate', { customerId: id });
  };

  // Handle view detail contact.
  const handleViewDetailCustomer = ({ id }: CustomerRow) => {
    openDrawer(DRAWERS.CUSTOMER_DETAILS, { customerId: id });
  };

  if (isEmptyStatus) {
    return <CustomersEmptyStatus />;
  }

  return (
    <Table
      columns={columns}
      data={customers}
      total={pagination?.total}
      loading={isCustomersLoading}
      fetching={isCustomersFetching}
      compact={compact}
      query={customersTableState}
      setQuery={setCustomersTableState}
      selectedIds={customersSelectedRows}
      setSelectedIds={setCustomersSelectedRows}
      actions={{
        onDelete: handleCustomerDelete,
        onEdit: handleCustomerEdit,
        onDuplicate: handleContactDuplicate,
        onInactivate: handleInactiveCustomer,
        onActivate: handleActivateCustomer,
        onViewDetails: handleViewDetailCustomer,
      }}
    />
  );
}

export const CustomersTable = FF.pipe(
  CustomersTableInner,
  withCustomers(({ customersTableState, customersSelectedRows }) => ({
    customersTableState,
    customersSelectedRows,
  })),
  withDrawerActions,
  withCustomersActions,
  withDialogActions,
  withAlertActions,
);
