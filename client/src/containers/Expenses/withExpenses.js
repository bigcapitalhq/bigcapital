import { connect } from 'react-redux';
import { getResourceViews } from 'store/customViews/customViews.selectors';
import {
  getExpensesCurrentPageFactory,
  getExpenseByIdFactory,
  getExpensesTableQuery,
  getExpensesPaginationMetaFactory,
  getExpensesCurrentViewIdFactory,
} from 'store/expenses/expenses.selectors';

export default (mapState) => {
  const getExpensesItems = getExpensesCurrentPageFactory();
  const getExpensesPaginationMeta = getExpensesPaginationMetaFactory();
  const getExpensesCurrentViewId = getExpensesCurrentViewIdFactory();

  const mapStateToProps = (state, props) => {
    const query = getExpensesTableQuery(state, props);

    const mapped = {
      expensesCurrentPage: getExpensesItems(state, props, query),
      expensesViews: getResourceViews(state, props, 'expenses'),
      expensesItems: state.expenses.items,
      expensesTableQuery: query,
      expensesPagination: getExpensesPaginationMeta(state, props),
      expensesLoading: state.expenses.loading,
      expensesCurrentViewId: getExpensesCurrentViewId(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };

  return connect(mapStateToProps);
};
