import React from 'react';
import { useHistory } from 'react-router-dom';

import CustomersEmptyStatus from './CustomersEmptyStatus';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';
import TableSkeletonHeader from 'components/Datatable/TableHeaderSkeleton';

import { DataTable } from 'components';

import withCustomers from './withCustomers';
import withCustomersActions from './withCustomersActions';
import withAlertsActions from 'containers/Alert/withAlertActions';
import withDialogActions from 'containers/Dialog/withDialogActions';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { useCustomersListContext } from './CustomersListProvider';
import { ActionsMenu, useCustomersTableColumns } from './components';

import { compose } from 'utils';

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
    openAlert('contact-inactivate', {
      contactId: id,
      service: contact_service,
    });
  };

  // Handle cancel/confirm  activate.
  const handleActivateCustomer = ({ id, contact_service }) => {
    openAlert('contact-activate', { contactId: id, service: contact_service });
  };

  // Handle view detail contact.
  const handleViewDetailCustomer = ({ id }) => {
    openDrawer('contact-detail-drawer', { contactId: id });
  };

  // Handle cell click.
  const handleCellClick = (cell, event) => {
    openDrawer('contact-detail-drawer', { contactId: cell.row.original.id });
  };

  if (isEmptyStatus) {
    return <CustomersEmptyStatus />;
  }

  return (
    <DataTable
      noInitialFetch={true}
      columns={columns}
      data={customers}
      initialState={customersTableState}
      loading={isCustomersLoading}
      headerLoading={isCustomersLoading}
      progressBarLoading={isCustomersFetching}
      onFetchData={handleFetchData}
      selectionColumn={true}
      expandable={false}
      sticky={true}
      spinnerProps={{ size: 30 }}
      pagination={true}
      manualSortBy={true}
      manualPagination={true}
      pagesCount={pagination.pagesCount}
      autoResetSortBy={false}
      autoResetPage={false}
      TableLoadingRenderer={TableSkeletonRows}
      TableHeaderSkeletonRenderer={TableSkeletonHeader}
      onCellClick={handleCellClick}
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
  );
}

export default compose(
  withAlertsActions,
  withDialogActions,
  withCustomersActions,
  withDrawerActions,
  withCustomers(({ customersTableState }) => ({ customersTableState })),
)(CustomersTable);
