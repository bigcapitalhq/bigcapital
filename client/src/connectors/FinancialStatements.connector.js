import {connect} from 'react-redux';
import {
  fetchGeneralLedger,
  fetchBalanceSheet,
} from 'store/financialStatement/financialStatements.actions';
import t from 'store/types';

export const mapStateToProps = (state, props) => ({
  generalLedeger: state.financialStatements.generalLedger,
});

export const mapDispatchToProps = (dispatch) => ({
  fetchGeneralLedger: (query = {}) => dispatch(fetchGeneralLedger({ query })),
  fetchBalanceSheet: (query = {}) => dispatch(fetchBalanceSheet({ query })),
});

export default connect(mapStateToProps, mapDispatchToProps);