// @ts-nocheck
import { connect } from 'react-redux';
import {
  setExpensesTableState,
  resetExpensesTableState,
  setExpensesSelectedRows,
} from '@/store/expenses/expenses.actions';

const mapDispatchToProps = (dispatch) => ({
  setExpensesTableState: (state) => dispatch(setExpensesTableState(state)),
  resetExpensesTableState: (state) => dispatch(resetExpensesTableState(state)),
  setExpensesSelectedRows: (selectedRows) =>
    dispatch(setExpensesSelectedRows(selectedRows)),
});

export default connect(null, mapDispatchToProps);
