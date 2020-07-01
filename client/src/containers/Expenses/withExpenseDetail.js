import { connect } from 'react-redux';
import { getExpenseByIdFactory } from 'store/expenses/expenses.selectors';

export default () => {
  const getExpenseById = getExpenseByIdFactory();

  const mapStateToProps = (state, props) => ({
    expenseDetail: getExpenseById(state, props),
  });
  return connect(mapStateToProps);
};