import {connect} from 'react-redux';
import {
  fetchGeneralLedger,
} from 'store/financialStatement/financialStatements.actions';
import {
  getFinancialSheetIndexByQuery,
  getFinancialSheet,
} from 'store/financialStatement/financialStatements.selectors';

export const mapStateToProps = (state, props) => ({
  getGeneralLedgerSheetIndex: (query) => getFinancialSheetIndexByQuery(state.financialStatements.generalLedger.sheets, query),
  getGeneralLedgerSheet: (index) => getFinancialSheet(state.financialStatements.generalLedger.sheets, index),
  generalLedgerSheetLoading: state.financialStatements.generalLedger.loading,
});

export const mapDispatchToProps = (dispatch) => ({
  fetchGeneralLedger: (query = {}) => dispatch(fetchGeneralLedger({ query })),
});

export default connect(mapStateToProps, mapDispatchToProps);