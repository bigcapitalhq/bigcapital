import React, { useCallback } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';

import CustomersViewsTabs from 'containers/Customers/CustomersViewsTabs';
import CustomersTable from 'containers/Customers/CustomerTable';

import withCustomersActions from 'containers/Customers/withCustomersActions';
import withAlertsActions from 'containers/Alert/withAlertActions';
import { compose } from 'utils';

function CustomersViewPage({
  // #withAlertsActions.
  openAlert,

  // #withCustomersActions
  setSelectedRowsCustomers,
}) {
  const history = useHistory();

  // Handle click delete customer.
  const handleDeleteCustomer = useCallback(
    ({ id }) => {
      openAlert('customer-delete', { customerId: id });
    },
    [openAlert],
  );

  // Handle select customer rows.
  const handleSelectedRowsChange = (selectedRows) => {
    const selectedRowsIds = selectedRows.map((r) => r.id);
    setSelectedRowsCustomers(selectedRowsIds);
  };

  const handleEditCustomer = useCallback(
    (customer) => {
      history.push(`/customers/${customer.id}/edit`);
    },
    [history],
  );

  return (
    <Switch>
      <Route
        exact={true}
        path={['/customers/:custom_view_id/custom_view', '/customers']}
      >
        <CustomersViewsTabs />
        <CustomersTable
          // onDeleteCustomer={handleDeleteCustomer}
          // onEditCustomer={handleEditCustomer}
          // onSelectedRowsChange={handleSelectedRowsChange}
        />
      </Route>
    </Switch>
  );
}

export default compose(
  withAlertsActions,
  withCustomersActions,
)(CustomersViewPage);
