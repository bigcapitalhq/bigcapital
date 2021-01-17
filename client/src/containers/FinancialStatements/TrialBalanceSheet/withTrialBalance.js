import {connect} from 'react-redux';
import {
  getFinancialSheetFactory,
  getFinancialSheetQueryFactory,
  getFinancialSheetTableRowsFactory,  
} from 'store/financialStatement/financialStatements.selectors';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const getTrialBalance = getFinancialSheetFactory('trialBalance');
    const getBalanceSheetQuery = getFinancialSheetQueryFactory('trialBalance');
    const getTrialBalanceRows = getFinancialSheetTableRowsFactory('trialBalance');

    const mapped = {
      trialBalance: getTrialBalance(state, props),
      trialBalanceQuery: getBalanceSheetQuery(state, props),
      trialBalanceTableRows: getTrialBalanceRows(state, props),
      trialBalanceSheetLoading: state.financialStatements.trialBalance.loading,
      trialBalanceSheetFilter: state.financialStatements.trialBalance.filter,
      trialBalanceSheetRefresh: state.financialStatements.trialBalance.refresh,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
