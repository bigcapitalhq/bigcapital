import {connect} from 'react-redux';
import {
  fetchExpense,
  submitExpense,
  editExpense,
  deleteExpense,
} from 'store/expenses/expenses.actions';
import {
  fetchAccountsList,
} from 'store/accounts/accounts.actions';
import {
  fetchCurrencies,
} from 'store/currencies/currencies.actions';
import t from 'store/types';

export const mapStateToProps = (state, props) => {
  return {
    expenseDetails: {},
    accounts: state.accounts.accounts,
    currencies: state.currencies.registered,
  };
};

export const mapDispatchToProps = (dispatch) => ({
  changePageTitle: pageTitle => dispatch({
    type: t.CHANGE_DASHBOARD_PAGE_TITLE,
    pageTitle,
  }),
  fetchCurrencies: () => dispatch(fetchCurrencies()),
  fetchExpense: (id) => dispatch(fetchExpense({ id })),
  submitExpense: (form) => dispatch(submitExpense({ form })),
  editExpense: (id, form) => dispatch(editExpense({ id, form })),
  fetchAccounts: () => dispatch(fetchAccountsList()),
  deleteExpense: (id) => dispatch(deleteExpense({ id })),
});

export default connect(mapStateToProps, mapDispatchToProps);