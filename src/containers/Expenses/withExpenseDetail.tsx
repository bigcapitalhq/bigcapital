// @ts-nocheck
import { connect } from 'react-redux';
import { getExpenseByIdFactory } from '@/store/expenses/expenses.selectors';

export default () => {
  const getExpenseById = getExpenseByIdFactory();

  const mapStateToProps = (state, props) => ({
    expense: getExpenseById(state, props),
  });
  return connect(mapStateToProps);
};
