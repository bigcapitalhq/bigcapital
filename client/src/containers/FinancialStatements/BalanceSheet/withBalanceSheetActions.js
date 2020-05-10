import {connect} from 'react-redux';
import {
  fetchBalanceSheet,
} from 'store/financialStatement/financialStatements.actions';

export const mapDispatchToProps = (dispatch) => ({
  fetchBalanceSheet: (query = {}) => dispatch(fetchBalanceSheet({ query })),  
});

export default connect(null, mapDispatchToProps);