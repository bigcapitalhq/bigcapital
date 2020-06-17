import { connect } from 'react-redux';
import {
  getFinancialSheet,
  getFinancialSheetAccounts,
  getFinancialSheetColumns,
  getFinancialSheetQuery,
} from 'store/financialStatement/financialStatements.selectors';


export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const { balanceSheetIndex } = props;
    const mapped = {
      balanceSheet: getFinancialSheet(state.financialStatements.balanceSheet.sheets, balanceSheetIndex),
      balanceSheetAccounts: getFinancialSheetAccounts(state.financialStatements.balanceSheet.sheets, balanceSheetIndex),
      balanceSheetColumns: getFinancialSheetColumns(state.financialStatements.balanceSheet.sheets, balanceSheetIndex),
      balanceSheetQuery: getFinancialSheetQuery(state.financialStatements.balanceSheet.sheets, balanceSheetIndex),
      balanceSheetLoading: state.financialStatements.balanceSheet.loading,
      balanceSheetFilter: state.financialStatements.balanceSheet.filter,
      balanceSheetRefresh: state.financialStatements.balanceSheet.refresh,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  
  return connect(mapStateToProps);
}
