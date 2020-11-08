import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { Intent, Alert } from '@blueprintjs/core';
import { useQuery } from 'react-query';
import {
  FormattedMessage as T,
  FormattedHTMLMessage,
  useIntl,
} from 'react-intl';

import AppToaster from 'components/AppToaster';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';

import CustomersTable from 'containers/Customers/CustomerTable';
import CustomerActionsBar from 'containers/Customers/CustomerActionsBar';
import CustomersViewsTabs from 'containers/Customers/CustomersViewsTabs';

import withCustomersActions from 'containers/Customers/withCustomersActions';
import withResourceActions from 'containers/Resources/withResourcesActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import { compose } from 'utils';

function CustomersList({
  // #withDashboardActions
  changePageTitle,

  // #withResourceActions
  requestFetchResourceViews,
  requestFetchResourceFields,

  //#withCustomersActions
  requestFetchCustomers,
  requestDeleteCustomer,
  requestDeleteBulkCustomers,
  addCustomersTableQueries,
}) {
  const [deleteCustomer, setDeleteCustomer] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [bulkDelete, setBulkDelete] = useState(false);

  const { formatMessage } = useIntl();

  const history = useHistory();

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'customers_list' }));
  }, [changePageTitle]);

  // Fetch customers resource views and fields.
  // const fetchHook = useQuery('resource-customers', () => {
  //   return Promise.all([
  //     requestFetchResourceViews('customers'),
  //     requestFetchResourceFields('customers'),
  //   ]);
  // });

  const fetchCustomers = useQuery('customers-table', () => {
    requestFetchCustomers({});
  });

  const handleEditCustomer = useCallback(
    (cusomter) => {
      history.push(`/customers/${cusomter.id}/edit`);
    },
    [history],
  );
  // Handle click delete customer.
  const handleDeleteCustomer = useCallback(
    (customer) => {
      setDeleteCustomer(customer);
    },
    [setDeleteCustomer],
  );

  // Handle cancel delete the customer.
  const handleCancelDeleteCustomer = useCallback(() => {
    setDeleteCustomer(false);
  }, [setDeleteCustomer]);

  // handle confirm delete customer.
  const handleConfirmDeleteCustomer = useCallback(() => {
    requestDeleteCustomer(deleteCustomer.id).then(() => {
      AppToaster.show({
        message: formatMessage({
          id: 'the_customer_has_been_successfully_deleted',
        }),
        intent: Intent.SUCCESS,
      });
      setDeleteCustomer(false);
    });
  }, [requestDeleteCustomer, deleteCustomer, formatMessage]);

  // Handle fetch data table.
  const handleFetchData = useCallback(
    ({ pageIndex, pageSize, sortBy }) => {
      addCustomersTableQueries({
        ...(sortBy.length > 0
          ? {
              column_sort_order: sortBy[0].id,
              sort_order: sortBy[0].desc ? 'desc' : 'asc',
            }
          : {}),
      });
      fetchCustomers.refetch();
    },
    [fetchCustomers, addCustomersTableQueries],
  );

  // Handle selected rows change.
  const handleSelectedRowsChange = useCallback(
    (customer) => {
      setSelectedRows(customer);
    },
    [setSelectedRows],
  );

  useEffect(() => {
    if (tableLoading && !fetchCustomers.isFetching) {
      setTableLoading(false);
    }
  }, [tableLoading, fetchCustomers.isFetching]);

  // Calculates the data table selected rows count.
  const selectedRowsCount = useMemo(() => Object.values(selectedRows).length, [
    selectedRows,
  ]);

  // Handle filter change to re-fetch the items.
  const handleFilterChanged = useCallback(
    (filterConditions) => {
      addCustomersTableQueries({
        filter_roles: filterConditions || '',
      });
    },
    [addCustomersTableQueries],
  );

  // Handle Customers bulk delete button click.,
  const handleBulkDelete = useCallback(
    (customersIds) => {
      setBulkDelete(customersIds);
    },
    [setBulkDelete],
  );

  // Handle cancel cusomters bulk delete.
  const handleCancelBulkDelete = useCallback(() => {
    setBulkDelete(false);
  }, []);

  // Handle confirm customers bulk delete.
  const handleConfirmBulkDelete = useCallback(() => {
    requestDeleteBulkCustomers(bulkDelete)
      .then(() => {
        setBulkDelete(false);
        AppToaster.show({
          message: formatMessage({
            id: 'the_customers_has_been_successfully_deleted',
          }),
          intent: Intent.SUCCESS,
        });
      })
      .catch((error) => {
        setBulkDelete(false);
      });
  }, [requestDeleteBulkCustomers, bulkDelete, formatMessage]);

  return (
    <DashboardInsider
      loading={fetchCustomers.isFetching}
      name={'customers-list'}
    >
      <CustomerActionsBar
        selectedRows={selectedRows}
        onFilterChanged={handleFilterChanged}
        onBulkDelete={handleBulkDelete}
      />

      <CustomersViewsTabs />

      <DashboardPageContent>
        <CustomersTable
          loading={tableLoading}
          onDeleteCustomer={handleDeleteCustomer}
          onEditCustomer={handleEditCustomer}
          onfetchData={handleFetchData}
          onSelectedRowsChange={handleSelectedRowsChange}
        />

        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={<T id={'delete'} />}
          icon="trash"
          intent={Intent.DANGER}
          isOpen={deleteCustomer}
          onCancel={handleCancelDeleteCustomer}
          onConfirm={handleConfirmDeleteCustomer}
        >
          <p>
            <FormattedHTMLMessage
              id={'once_delete_this_customer_you_will_able_to_restore_it'}
            />
          </p>
        </Alert>

        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={`${formatMessage({
            id: 'delete',
          })} (${selectedRowsCount})`}
          icon="trash"
          intent={Intent.DANGER}
          isOpen={bulkDelete}
          onCancel={handleCancelBulkDelete}
          onConfirm={handleConfirmBulkDelete}
        >
          <p>
            <T
              id={'once_delete_these_customers_you_will_not_able_restore_them'}
            />
          </p>
        </Alert>
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export default compose(
  withResourceActions,
  withDashboardActions,
  withCustomersActions,
)(CustomersList);
