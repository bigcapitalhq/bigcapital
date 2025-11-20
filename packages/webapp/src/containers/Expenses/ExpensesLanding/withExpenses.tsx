// @ts-nocheck
import { connect } from 'react-redux';
import {
  expensesTableStateChangedFactory,
  getExpensesSelectedRowsFactory,
  getExpensesTableStateFactory,
} from '@/store/expenses/expenses.selectors';

export default (mapState) => {
  const getExpensesTableState = getExpensesTableStateFactory();
  const expensesTableStateChanged = expensesTableStateChangedFactory();
  const getSelectedRows = getExpensesSelectedRowsFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      expensesTableState: getExpensesTableState(state, props),
      expensesTableStateChanged: expensesTableStateChanged(state, props),
      expensesSelectedRows: getSelectedRows(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
