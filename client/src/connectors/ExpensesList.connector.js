import {connect} from 'react-redux';
import {
  fetchExpensesList,
  deleteExpense,
} from 'store/expenses/expenses.actions';
import t from 'store/types';

export const mapStateToProps = (state, props) => {
  return {
    expenses: state.expenses.list,
  };
};

export const mapDispatchToProps = (dispatch) => ({
  changePageTitle: pageTitle => dispatch({
    type: t.CHANGE_DASHBOARD_PAGE_TITLE,
    pageTitle,
  }),
  fetchExpenses: (id) => dispatch(fetchExpensesList({ id })),
  deleteExpense: (id) => dispatch(deleteExpense({ id })),
});

export default connect(mapStateToProps, mapDispatchToProps);