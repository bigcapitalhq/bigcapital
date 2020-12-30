import { connect } from 'react-redux';
import {
  getFinancialSheetFactory,
  getFinancialSheetAccountsFactory,
  getFinancialSheetColumnsFactory,
  getFinancialSheetQueryFactory,
  getFinancialSheetTableRowsFactory,
} from 'store/financialStatement/financialStatements.selectors';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const getBalanceSheet = getFinancialSheetFactory('balanceSheet');
    const getBalanceSheetAccounts = getFinancialSheetAccountsFactory(
      'balanceSheet',
    );
    const getBalanceSheetTableRows = getFinancialSheetTableRowsFactory(
      'balanceSheet',
    );
    const getBalanceSheetColumns = getFinancialSheetColumnsFactory('balanceSheet');
    const getBalanceSheetQuery = getFinancialSheetQueryFactory('balanceSheet');

    const mapped = {
      balanceSheet: getBalanceSheet(state, props),
      balanceSheetAccounts: getBalanceSheetAccounts(state, props),
      balanceSheetTableRows: getBalanceSheetTableRows(state, props),
      balanceSheetColumns: getBalanceSheetColumns(state, props),
      balanceSheetQuery: getBalanceSheetQuery(state, props),
      balanceSheetLoading: state.financialStatements.balanceSheet.loading,
      balanceSheetFilter: state.financialStatements.balanceSheet.filter,
      balanceSheetRefresh: state.financialStatements.balanceSheet.refresh,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };

  return connect(mapStateToProps);
};
