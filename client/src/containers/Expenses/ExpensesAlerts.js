import React from 'react';
import ExpenseDeleteAlert from 'alerts/expenses/ExpenseDeleteAlert';
import ExpensePublishAlert from 'alerts/expenses/ExpensePublishAlert';

/**
 * Accounts alert.
 */
export default function ExpensesAlerts({

}) {
  return (
    <div class="expenses-alerts">
      <ExpenseDeleteAlert name={'expense-delete'} />
      <ExpensePublishAlert name={'expense-publish'} />
    </div>
  )
}