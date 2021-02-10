import React from 'react';
import ExpenseDeleteAlert from 'containers/Alerts/Expenses/ExpenseDeleteAlert';
import ExpensePublishAlert from 'containers/Alerts/Expenses/ExpensePublishAlert';

/**
 * Accounts alert.
 */
export default function ExpensesAlerts({}) {
  return (
    <div class="expenses-alerts">
      <ExpenseDeleteAlert name={'expense-delete'} />
      <ExpensePublishAlert name={'expense-publish'} />
    </div>
  );
}
