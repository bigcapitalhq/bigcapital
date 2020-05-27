import {connect} from 'react-redux';
import {
  fetchBalanceSheet,
} from 'store/financialStatement/financialStatements.actions';

const mapDispatchToProps = (dispatch) => ({
  fetchBalanceSheet: (query = {}) => dispatch(fetchBalanceSheet({ query })),  
  toggleBalanceSheetFilter: () => dispatch({ type: 'BALANCE_SHEET_FILTER_TOGGLE' }),
});

export default connect(null, mapDispatchToProps);