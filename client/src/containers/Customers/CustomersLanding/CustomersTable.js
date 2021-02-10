import React from 'react';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';

import CustomersEmptyStatus from './CustomersEmptyStatus';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';
import TableSkeletonHeader from 'components/Datatable/TableHeaderSkeleton';

import { DataTable, Choose } from 'components';
import { CLASSES } from 'common/classes';

import withCustomersActions from './withCustomersActions';
import withAlertsActions from 'containers/Alert/withAlertActions';
import withDialogActions from 'containers/Dialog/withDialogActions';

import { useCustomersListContext } from './CustomersListProvider';
import { ActionsMenu, useCustomersTableColumns } from './components';

import { compose } from 'utils';

/**
 * Customers table.
 */
function CustomersTable({
  // #withCustomersActions
  setCustomersTableState, 

  // #withAlerts
  openAlert
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
  const handleCustomerDelete = (customer) => {
    openAlert('customer-delete', { customerId: customer.id })
  };

  // Handle the customer edit action.
  const handleCustomerEdit = (customer) => {
    history.push(`/customers/${customer.id}/edit`);
  };
 
  return (
    <div className={classNames(CLASSES.DASHBOARD_DATATABLE)}>
      <Choose>
        <Choose.When condition={isEmptyStatus}>
          <CustomersEmptyStatus />
        </Choose.When>

        <Choose.Otherwise>
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
            manualSortBy={true}
            manualPagination={true}
            pagesCount={pagination.pagesCount}

            autoResetSortBy={false}
            autoResetPage={false}

            TableLoadingRenderer={TableSkeletonRows}
            TableHeaderSkeletonRenderer={TableSkeletonHeader}

            payload={{
              onDelete: handleCustomerDelete,
              onEdit: handleCustomerEdit,
            }}
            ContextMenu={ActionsMenu}
          />
        </Choose.Otherwise>
      </Choose>
    </div>
  );
};

export default compose(
  withAlertsActions,
  withDialogActions,
  withCustomersActions,
)(CustomersTable);
