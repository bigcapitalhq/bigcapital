import {connect} from 'react-redux';
import {
  fetchGeneralLedger,
  refreshGeneralLedgerSheet,
} from 'store/financialStatement/financialStatements.actions';

const mapDispatchToProps = (dispatch) => ({
  fetchGeneralLedger: (query = {}) => dispatch(fetchGeneralLedger({ query })),
  toggleGeneralLedgerSheetFilter: () => dispatch({ type: 'GENERAL_LEDGER_FILTER_TOGGLE' }),
  refreshGeneralLedgerSheet: (refresh) => dispatch(refreshGeneralLedgerSheet(refresh)),
});

export default connect(null, mapDispatchToProps);