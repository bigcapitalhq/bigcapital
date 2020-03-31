import {connect} from 'react-redux';
import {
  fetchTrialBalanceSheet
} from 'store/financialStatement/financialStatements.actions';
import {
  getTrialBalanceSheetIndex,
  getTrialBalanceAccounts,
  getTrialBalanceQuery,
  getFinancialSheetIndexByQuery,
} from 'store/financialStatement/financialStatements.selectors';

export const mapStateToProps = (state, props) => ({
  getTrialBalanceSheetIndex: (query) => getFinancialSheetIndexByQuery(state.financialStatements.trialBalance.sheets, query),
  getTrialBalanceAccounts: (sheetIndex) => getTrialBalanceAccounts(state.financialStatements.trialBalance.sheets, sheetIndex),
  getTrialBalanceQuery: (sheetIndex) => getTrialBalanceQuery(state.financialStatements.trialBalance.sheets, sheetIndex),

  trialBalanceSheetLoading: state.financialStatements.trialBalance.loading,
});

export const mapDispatchToProps = (dispatch) => ({
  fetchTrialBalanceSheet: (query = {}) => dispatch(fetchTrialBalanceSheet({ query })),
});

export default connect(mapStateToProps, mapDispatchToProps);