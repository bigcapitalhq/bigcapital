import {connect} from 'react-redux';
import {
  fetchBalanceSheet,
} from 'store/financialStatement/financialStatements.actions';

const mapDispatchToProps = (dispatch) => ({
  fetchBalanceSheet: (query = {}) => dispatch(fetchBalanceSheet({ query })),  
});

export default connect(null, mapDispatchToProps);