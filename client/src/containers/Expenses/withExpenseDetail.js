import { connect } from 'react-redux';
import { getExpenseById } from 'store/expenses/expenses.reducer';

const mapStateToProps = (state, props) => {

  return {
    expenseDetail: getExpenseById(state, props.expenseId),
  };
};

export default connect(mapStateToProps);
