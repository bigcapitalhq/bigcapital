import {connect} from 'react-redux';
import {
  fetchGeneralLedger,
} from 'store/financialStatement/financialStatements.actions';

const mapDispatchToProps = (dispatch) => ({
  fetchGeneralLedger: (query = {}) => dispatch(fetchGeneralLedger({ query })),
  toggleGeneralLedgerSheetFilter: () => dispatch({ type: 'GENERAL_LEDGER_FILTER_TOGGLE' }),
});

export default connect(null, mapDispatchToProps);