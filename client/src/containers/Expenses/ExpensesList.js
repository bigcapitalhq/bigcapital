import React, { useEffect, useState } from 'react';
import { useAsync } from 'react-use';
import { Alert, Intent } from '@blueprintjs/core';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import ExpensesActionsBar from 'components/Expenses/ExpensesActionsBar';
import ExpensesViewsTabs from 'components/Expenses/ExpensesViewsTabs';
import ExpensesTable from 'components/Expenses/ExpensesTable';
import connector from 'connectors/ExpensesList.connector';
import AppToaster from 'components/AppToaster';

function ExpensesList({
  fetchExpenses,
  deleteExpense,
  // fetchViews,
  expenses,
  getResourceViews,
  changePageTitle
}) {
  useEffect(() => {
    changePageTitle('Expenses List');
  }, []);

  const [deleteExpenseState, setDeleteExpense] = useState();

  const handleDeleteExpense = expense => {
    setDeleteExpense(expense);
  };
  const handleCancelAccountDelete = () => {
    setDeleteExpense(false);
  };

  const handleConfirmAccountDelete = () => {
    deleteExpense(deleteExpenseState.id).then(() => {
      setDeleteExpense(false);
      AppToaster.show({
        message: 'the_expense_has_been_deleted'
      });
    });
  };

  const fetchHook = useAsync(async () => {
    await Promise.all([
      fetchExpenses()
      // getResourceViews('expenses'),
    ]);
  });

  return (
    <DashboardInsider loading={false}>
      <ExpensesActionsBar />
      <ExpensesViewsTabs />

      <DashboardPageContent>
        <ExpensesTable
          expenses={expenses}
          onDeleteExpense={handleDeleteExpense}
        />
      </DashboardPageContent>

      <Alert
        cancelButtonText='Cancel'
        confirmButtonText='Move to Trash'
        icon='trash'
        intent={Intent.DANGER}
        isOpen={deleteExpenseState}
        onCancel={handleCancelAccountDelete}
        onConfirm={handleConfirmAccountDelete}
      >
        <p>
          Are you sure you want to move <b>filename</b> to Trash? You will be
          able to restore it later, but it will become private to you.
        </p>
      </Alert>
    </DashboardInsider>
  );
}

export default connector(ExpensesList);
