import { connect } from 'react-redux';
import { getResourceViews } from 'store/customViews/customViews.selectors';
import { getExpensesItems } from 'store/expenses/expenses.selectors';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const mapped = {
      expenses: getExpensesItems(state, state.expenses.currentViewId),
      expensesViews: getResourceViews(state, props, 'expenses'),
      expensesItems: state.expenses.items,
      expensesTableQuery: state.expenses.tableQuery,
      expensesLoading: state.expenses.loading,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };

  return connect(mapStateToProps);
};
