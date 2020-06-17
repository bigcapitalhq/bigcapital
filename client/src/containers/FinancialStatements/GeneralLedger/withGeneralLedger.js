import { connect } from 'react-redux';
import {
  getFinancialSheet,
  getFinancialSheetQuery,
  getFinancialSheetTableRows,
} from 'store/financialStatement/financialStatements.selectors';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const { generalLedgerIndex } = props;

    const mapped = {
      generalLedgerSheet: getFinancialSheet(
        state.financialStatements.generalLedger.sheets,
        generalLedgerIndex,
      ),
      generalLedgerTableRows: getFinancialSheetTableRows(
        state.financialStatements.generalLedger.sheets,
        generalLedgerIndex,
      ),
      generalLedgerQuery: getFinancialSheetQuery(
        state.financialStatements.generalLedger.sheets,
        generalLedgerIndex,
      ),
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
