import { connect } from 'react-redux';
import {
  getFinancialSheetFactory,
  getFinancialSheetQueryFactory,
  getFinancialSheetTableRowsFactory,
} from 'store/financialStatement/financialStatements.selectors';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const getGeneralLedgerSheet = getFinancialSheetFactory('generalLedger');
    const getSheetTableRows = getFinancialSheetTableRowsFactory('generalLedger');
    const getSheetQuery = getFinancialSheetQueryFactory('generalLedger');

    const mapped = {
      generalLedgerSheet: getGeneralLedgerSheet(state, props),
      generalLedgerTableRows: getSheetTableRows(state, props),
      generalLedgerQuery: getSheetQuery(state, props),
      generalLedgerSheetLoading:
        state.financialStatements.generalLedger.loading,
      generalLedgerSheetFilter: state.financialStatements.generalLedger.filter,
      generalLedgerSheetRefresh:
        state.financialStatements.generalLedger.refresh,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
