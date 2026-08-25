import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import type { Customer } from '@bigcapital/sdk-ts';
import { ActionsMenu, useCustomersTableColumns } from './components';
import { CustomersEmptyStatus } from './CustomersEmptyStatus';
import { useCustomersListContext } from './CustomersListProvider';
import { withCustomers } from './withCustomers';
import type { WithCustomersProps } from './withCustomers';
import { withCustomersActions } from './withCustomersActions';
import type { WithCustomersActionsProps } from './withCustomersActions';
import {
  DataTable,
  DashboardContentTable,
  TableSkeletonRows,
  TableSkeletonHeader,
} from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { TABLES } from '@/constants/tables';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { useMemorizedColumnsWidths } from '@/hooks';
import { compose } from '@/utils';

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
type SortBy = Array<{ id: string; desc: boolean }>;

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

  // Customers table columns.
  const columns = useCustomersTableColumns();

  // Customers list context.
  const {
    isEmptyStatus,
    customers,
    pagination,
    isCustomersLoading,
    isCustomersFetching,
    customersSettings,
  } = useCustomersListContext();
  const customersTableSize = customersSettings?.tableSize as string | undefined;

  // Local storage memorizing columns widths.
  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.CUSTOMER);

  // Handle fetch data once the page index, size or sort by of the table change.
  const handleFetchData = React.useCallback(
    ({
      pageSize,
      pageIndex,
      sortBy,
    }: {
      pageSize: number;
      pageIndex: number;
      sortBy: SortBy;
    }) => {
      setCustomersTableState({
        pageIndex,
        pageSize,
        sortBy,
      });
    },
    [setCustomersTableState],
  );

  const handleSelectedRowsChange = React.useCallback(
    (selectedFlatRows: Array<{ original: CustomerRow }>) => {
      const selectedIds = selectedFlatRows?.map((row) => row.original.id) || [];
      setCustomersSelectedRows(selectedIds);
    },
    [setCustomersSelectedRows],
  );

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

  // Handle cell click.
  const handleCellClick = (
    cell: { row: { original: CustomerRow } },
    _event: React.MouseEvent,
  ) => {
    openDrawer(DRAWERS.CUSTOMER_DETAILS, {
      customerId: cell.row.original.id,
    });
  };

  if (isEmptyStatus) {
    return <CustomersEmptyStatus />;
  }

  return (
    <DashboardContentTable>
      <DataTable
        noInitialFetch={true}
        columns={columns}
        data={customers ?? []}
        loading={isCustomersLoading}
        headerLoading={isCustomersLoading}
        progressBarLoading={isCustomersFetching}
        onFetchData={handleFetchData}
        selectionColumn={true}
        expandable={false}
        sticky={true}
        spinnerProps={{ size: 30 }}
        pagination={true}
        rowTestId={'customer-row'}
        initialPageSize={customersTableState?.pageSize ?? 10}
        manualSortBy={true}
        manualPagination={true}
        rowsCount={pagination?.total ?? 0}
        onSelectedRowsChange={handleSelectedRowsChange}
        selectedRowsIds={customersSelectedRows}
        autoResetSelectedRows={false}
        autoResetSortBy={false}
        autoResetPage={false}
        TableLoadingRenderer={TableSkeletonRows}
        TableHeaderSkeletonRenderer={TableSkeletonHeader}
        onCellClick={handleCellClick}
        initialColumnsWidths={initialColumnsWidths}
        onColumnResizing={handleColumnResizing}
        size={customersTableSize}
        payload={{
          onDelete: handleCustomerDelete,
          onEdit: handleCustomerEdit,
          onDuplicate: handleContactDuplicate,
          onInactivate: handleInactiveCustomer,
          onActivate: handleActivateCustomer,
          onViewDetails: handleViewDetailCustomer,
        }}
        ContextMenu={ActionsMenu}
      />
    </DashboardContentTable>
  );
}

export const CustomersTable = compose(
  withAlertActions,
  withDialogActions,
  withCustomersActions,
  withDrawerActions,
  withCustomers(({ customersTableState, customersSelectedRows }) => ({
    customersTableState,
    customersSelectedRows,
  })),
)(CustomersTableInner);
