import React from 'react';
import { useParams } from 'react-router-dom';

import 'style/pages/Expense/PageForm.scss';

import ExpenseForm from './ExpenseForm';
import { ExpenseFormPageProvider } from './ExpenseFormPageProvider';
import withCurrentOrganization from 'containers/Organization/withCurrentOrganization';
import { compose } from 'utils';
/**
 * Expense page form.
 */
function ExpenseFormPage({
  // #withCurrentOrganization
  organization: { base_currency },
}) {
  const { id } = useParams();
  const expenseId = parseInt(id, 10);

  return (
    <ExpenseFormPageProvider expenseId={expenseId} baseCurrency={base_currency}>
      <ExpenseForm />
    </ExpenseFormPageProvider>
  );
}
export default compose(withCurrentOrganization())(ExpenseFormPage);
