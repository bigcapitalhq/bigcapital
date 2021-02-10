import { connect } from 'react-redux';
import { getExpensesTableStateFactory } from 'store/expenses/expenses.selectors';

export default (mapState) => {
  const getExpensesTableState = getExpensesTableStateFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      expensesTableState: getExpensesTableState(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };

  return connect(mapStateToProps);
};
