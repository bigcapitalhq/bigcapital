import { connect } from 'react-redux';
import {
  submitExpense,
  fetchExpense,
  editExpense,
  deleteExpense,
  deleteBulkExpenses,
  publishExpense,
  fetchExpensesTable,
} from 'store/expenses/expenses.actions';
import t from 'store/types';

export const mapDispatchToProps = (dispatch) => ({
  requestSubmitExpense: (form) => dispatch(submitExpense({ form })),
  requestFetchExpense: (id) => dispatch(fetchExpense({ id })),
  requestEditExpense: (id, form) => dispatch(editExpense({ id, form })),
  requestDeleteExpense: (id) => dispatch(deleteExpense({ id })),
  requestFetchExpensesTable: (query = {}) =>
    dispatch(fetchExpensesTable({ query: { ...query } })),
  requestPublishExpense: (id) => dispatch(publishExpense({ id })),
  requestDeleteBulkExpenses: (ids) => dispatch(deleteBulkExpenses({ ids })),

  changeExpensesView: (id) =>
    dispatch({
      type: t.EXPENSES_SET_CURRENT_VIEW,
      currentViewId: parseInt(id, 10),
    }),

  addExpensesTableQueries: (queries) =>
    dispatch({
      type: t.EXPENSES_TABLE_QUERIES_ADD,
      queries,
    }),
});

export default connect(null, mapDispatchToProps);
