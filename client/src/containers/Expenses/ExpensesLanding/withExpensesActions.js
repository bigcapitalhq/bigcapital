import { connect } from 'react-redux';
import { setExpensesTableState } from 'store/expenses/expenses.actions';

const mapDispatchToProps = (dispatch) => ({
  setExpensesTableState: (state) => dispatch(setExpensesTableState(state)),
});

export default connect(null, mapDispatchToProps);
