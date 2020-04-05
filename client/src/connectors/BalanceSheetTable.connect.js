import {connect} from 'react-redux';
import {
  fetchBalanceSheet,
} from 'store/financialStatement/financialStatements.actions';
import {
  getFinancialSheetIndexByQuery,
  getFinancialSheet,
  getFinancialSheetsAccounts,
  getFinancialSheetsColumns,
} from 'store/financialStatement/financialStatements.selectors';


export const mapStateToProps = (state, props) => {
  const sheetIndex = props.balanceSheetIndex;

  return {
    balanceSheetAccounts: props.getBalanceSheetAccounts(sheetIndex),
    balanceSheetQuery: props.getBalanceSheetQuery(sheetIndex),
    balanceSheetColumns: props.getBalanceSheetColumns(sheetIndex),
  };
};

export const mapDispatchToProps = (dispatch) => ({
  
});

export default connect(mapStateToProps, mapDispatchToProps);