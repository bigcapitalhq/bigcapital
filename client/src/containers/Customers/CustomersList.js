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

import withCustomers from 'containers/Customers/withCustomers';
import withCustomersActions from 'containers/Customers/withCustomersActions';
import withResourceActions from 'containers/Resources/withResourcesActions';
import withViewsActions from 'containers/Views/withViewsActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import { compose } from 'utils';

import 'style/pages/Customers/List.scss';

/**
 * Customers list.
 */
function CustomersList({
  // #withDashboardActions
  changePageTitle,

  // #withResourceActions
  requestFetchResourceViews,
  requestFetchResourceFields,

  // #withCustomers
  customersTableQuery,

  // #withCustomersActions
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
  }, [changePageTitle, formatMessage]);

  // Fetch customers resource views and fields.
  const fetchResourceViews = useQuery(
    ['resource-views', 'customers'],
    (key, resourceName) => requestFetchResourceViews(resourceName),
  );

  const fetchCustomers = useQuery(
    ['customers-table', customersTableQuery],
    (key, query) => requestFetchCustomers({ ...query }),
  );

  const handleEditCustomer = useCallback(
    (customer) => {
      history.push(`/customers/${customer.id}/edit`);
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

  const transformErrors = (errors) => {
    if (errors.some((e) => e.type === 'CUSTOMER.HAS.SALES_INVOICES')) {
      AppToaster.show({
        message: formatMessage({
          id: 'customer_has_sales_invoices',
        }),
        intent: Intent.DANGER,
      });
    }
  };

  // handle confirm delete customer.
  const handleConfirmDeleteCustomer = useCallback(() => {
    requestDeleteCustomer(deleteCustomer.id)
      .then(() => {
        setDeleteCustomer(false);
        AppToaster.show({
          message: formatMessage({
            id: 'the_customer_has_been_deleted_successfully',
          }),
          intent: Intent.SUCCESS,
        });
      })
      .catch((errors) => {
        setDeleteCustomer(false);
        transformErrors(errors);
      });
  }, [requestDeleteCustomer, deleteCustomer, formatMessage]);

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

  const transformApiErrors = (errors) => {
    if (
      errors.find(
        (error) => error.type === 'SOME.CUSTOMERS.HAVE.SALES_INVOICES',
      )
    ) {
      AppToaster.show({
        message: formatMessage({
          id: 'some_customers_have_sales_invoices',
        }),
        intent: Intent.DANGER,
      });
    }
  };
  // Handle confirm customers bulk delete.
  const handleConfirmBulkDelete = useCallback(() => {
    requestDeleteBulkCustomers(bulkDelete)
      .then(() => {
        setBulkDelete(false);
        AppToaster.show({
          message: formatMessage({
            id: 'the_customers_has_been_deleted_successfully',
          }),
          intent: Intent.SUCCESS,
        });
      })
      .catch((errors) => {
        transformApiErrors(errors);
        setBulkDelete(false);
      });
  }, [requestDeleteBulkCustomers, bulkDelete, formatMessage]);

  return (
    <DashboardInsider
      loading={fetchResourceViews.isFetching}
      name={'customers-list'}
    >
      <CustomerActionsBar
        selectedRows={selectedRows}
        onBulkDelete={handleBulkDelete}
      />

      <DashboardPageContent>
        <Switch>
          <Route
            exact={true}
            path={['/customers/:custom_view_id/custom_view', '/customers']}
          >
            <CustomersViewsTabs />
            <CustomersTable
              onDeleteCustomer={handleDeleteCustomer}
              onEditCustomer={handleEditCustomer}
              onSelectedRowsChange={handleSelectedRowsChange}
            />
          </Route>
        </Switch>

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
  withCustomersActions,
  withDashboardActions,
  withViewsActions,
  withCustomers(({ customersTableQuery }) => ({ customersTableQuery })),
)(CustomersList);
