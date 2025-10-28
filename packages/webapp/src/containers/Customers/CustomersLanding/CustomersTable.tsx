// @ts-nocheck
import React from 'react';
import { useHistory } from 'react-router-dom';

import CustomersEmptyStatus from './CustomersEmptyStatus';

import { TABLES } from '@/constants/tables';
import {
  DataTable,
  DashboardContentTable,
  TableSkeletonRows,
  TableSkeletonHeader,
} from '@/components';
import { ActionsMenu, useCustomersTableColumns } from './components';

import withCustomers from './withCustomers';
import withCustomersActions from './withCustomersActions';
import withAlertsActions from '@/containers/Alert/withAlertActions';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';
import withSettings from '@/containers/Settings/withSettings';

import { useCustomersListContext } from './CustomersListProvider';
import { useMemorizedColumnsWidths } from '@/hooks';

import { compose } from '@/utils';
import { DRAWERS } from '@/constants/drawers';

/**
 * Customers table.
 */
function CustomersTable({
  // #withCustomersActions
  setCustomersTableState,

  // #withCustomers
  customersTableState,

  // #withAlerts
  openAlert,

  // #withDrawerActions
  openDrawer,

  // #withDialogActions
  openDialog,

  // #withSettings
  customersTableSize,
}) {
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
  } = useCustomersListContext();

  // Local storage memorizing columns widths.
  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.CUSTOMERS);

  // Handle fetch data once the page index, size or sort by of the table change.
  const handleFetchData = React.useCallback(
    ({ pageSize, pageIndex, sortBy }) => {
      setCustomersTableState({
        pageIndex,
        pageSize,
        sortBy,
      });
    },
    [setCustomersTableState],
  );

  // Handles the customer delete action.
  const handleCustomerDelete = ({ id }) => {
    openAlert('customer-delete', { contactId: id });
  };

  // Handle the customer edit action.
  const handleCustomerEdit = (customer) => {
    history.push(`/customers/${customer.id}/edit`);
  };

  const handleContactDuplicate = ({ id }) => {
    openDialog('contact-duplicate', { contactId: id });
  };

  // Handle cancel/confirm inactive.
  const handleInactiveCustomer = ({ id, contact_service }) => {
    openAlert('customer-inactivate', {
      customerId: id,
    });
  };

  // Handle cancel/confirm  activate.
  const handleActivateCustomer = ({ id, contact_service }) => {
    openAlert('customer-activate', {
      customerId: id,
      service: contact_service,
    });
  };

  // Handle view detail contact.
  const handleViewDetailCustomer = ({ id }) => {
    openDrawer(DRAWERS.CUSTOMER_DETAILS, { customerId: id });
  };

  // Handle cell click.
  const handleCellClick = (cell, event) => {
    openDrawer(DRAWERS.CUSTOMER_DETAILS, { customerId: cell.row.original.id });
  };

  if (isEmptyStatus) {
    return <CustomersEmptyStatus />;
  }

  return (
    <DashboardContentTable>
      <DataTable
        noInitialFetch={true}
        columns={columns}
        data={customers}
        loading={isCustomersLoading}
        headerLoading={isCustomersLoading}
        progressBarLoading={isCustomersFetching}
        onFetchData={handleFetchData}
        selectionColumn={true}
        expandable={false}
        sticky={true}
        spinnerProps={{ size: 30 }}
        pagination={true}
        initialPageSize={customersTableState.pageSize}
        manualSortBy={true}
        manualPagination={true}
        pagesCount={pagination.pagesCount}
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

export default compose(
  withAlertsActions,
  withDialogActions,
  withCustomersActions,
  withDrawerActions,
  withCustomers(({ customersTableState }) => ({ customersTableState })),
  withSettings(({ customersSettings }) => ({
    customersTableSize: customersSettings?.tableSize,
  })),
)(CustomersTable);
