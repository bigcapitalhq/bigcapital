import { connect } from 'react-redux';
import {
  fetchBalanceSheet,
  balanceSheetRefresh,
} from 'store/financialStatement/financialStatements.actions';

const mapDispatchToProps = (dispatch) => ({
  fetchBalanceSheet: (query = {}) => dispatch(fetchBalanceSheet({ query })),
  toggleBalanceSheetFilter: () =>
    dispatch({ type: 'BALANCE_SHEET_FILTER_TOGGLE' }),
  refreshBalanceSheet: (refresh) => dispatch(balanceSheetRefresh(refresh)),
});

export default connect(null, mapDispatchToProps);
