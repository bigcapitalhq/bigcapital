import {connect} from 'react-redux';
import {
  fetchTrialBalanceSheet
} from 'store/financialStatement/financialStatements.actions';
import {
  getTrialBalanceSheetIndex,
  getTrialBalanceAccounts,
  getTrialBalanceQuery,
} from 'store/financialStatement/financialStatements.selectors';

export const mapStateToProps = (state, props) => ({
  getTrialBalanceSheetIndex: (query) => getTrialBalanceSheetIndex(state.financialStatements.trialBalanceSheets, query),
  getTrialBalanceAccounts: (sheetIndex) => getTrialBalanceAccounts(state.financialStatements.trialBalanceSheets, sheetIndex),
  getTrialBalanceQuery: (sheetIndex) => getTrialBalanceQuery(state.financialStatements.trialBalanceSheets, sheetIndex),
});

export const mapDispatchToProps = (dispatch) => ({
  fetchTrialBalanceSheet: (query = {}) => dispatch(fetchTrialBalanceSheet({ query })),
});

export default connect(mapStateToProps, mapDispatchToProps);