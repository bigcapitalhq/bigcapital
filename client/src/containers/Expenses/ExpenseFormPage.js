import React, { useCallback, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import ExpenseForm from './ExpenseForm';
import { ExpenseFormPageProvider } from './ExpenseFormPageProvider';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import { compose } from 'utils';

import 'style/pages/Expense/PageForm.scss';

/**
 * Expense page form.
 */
function ExpenseFormPage({
  // #withDashboardActions
  setSidebarShrink,
  resetSidebarPreviousExpand,
  setDashboardBackLink,
}) {
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    // Shrink the sidebar by foce.
    setSidebarShrink();
    // Show the back link on dashboard topbar.
    setDashboardBackLink(true);

    return () => {
      // Reset the sidebar to the previous status.
      resetSidebarPreviousExpand();
      // Hide the back link on dashboard topbar.
      setDashboardBackLink(false);
    };
  }, [resetSidebarPreviousExpand, setSidebarShrink, setDashboardBackLink]);

  const handleFormSubmit = useCallback(
    (payload) => {
      payload.redirect && history.push('/expenses-list');
    },
    [history],
  );

  const handleCancel = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <ExpenseFormPageProvider expenseId={id}>
      <ExpenseForm
        onFormSubmit={handleFormSubmit}
        expenseId={id}
        onCancelForm={handleCancel}
      />
    </ExpenseFormPageProvider>
  );
}

export default compose(
  withDashboardActions,
)(ExpenseFormPage);
