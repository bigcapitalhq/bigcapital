import React from 'react';
import { Route, Switch } from 'react-router-dom';

import ExpenseViewTabs from 'containers/Expenses/ExpenseViewTabs';
import ExpenseDataTable from './ExpenseDataTable';

import withAlertsActions from 'containers/Alert/withAlertActions';
import withDialogActions from 'containers/Dialog/withDialogActions';

import { compose } from 'utils';

/**
 * Expenses inner page.
 */
function ExpensesViewPage() {
  return (
    <Switch>
      <Route
        exact={true}
        path={['/expenses/:custom_view_id/custom_view', '/expenses']}
      >
        <ExpenseViewTabs />
        <ExpenseDataTable />
              {/* // onDeleteExpense={handleDeleteExpense}
              // onEditExpense={handleEidtExpense}
              // onPublishExpense={handlePublishExpense}
              // onSelectedRowsChange={handleSelectedRowsChange}
            // /> */}
      </Route>
    </Switch>
  );
}

export default compose(
  withAlertsActions,
  withDialogActions,
)(ExpensesViewPage);
