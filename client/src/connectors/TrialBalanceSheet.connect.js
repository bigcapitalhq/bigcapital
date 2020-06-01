// import {connect} from 'react-redux';
// import {
//   fetchTrialBalanceSheet
// } from 'store/financialStatement/financialStatements.actions';
// import {
//   getFinancialSheetIndexByQuery,
//   getFinancialSheetAccounts,
//   getFinancialSheetQuery,
// } from 'store/financialStatement/financialStatements.selectors';


// export const mapStateToProps = (state, props) => ({
//   getTrialBalanceSheetIndex: (query) => getFinancialSheetIndexByQuery(state.financialStatements.trialBalance.sheets, query),
//   getTrialBalanceAccounts: (sheetIndex) => getFinancialSheetAccounts(state.financialStatements.trialBalance.sheets, sheetIndex),
//   getTrialBalanceQuery: (sheetIndex) => getFinancialSheetQuery(state.financialStatements.trialBalance.sheets, sheetIndex),

//   trialBalanceSheetLoading: state.financialStatements.trialBalance.loading,
// });

// export const mapDispatchToProps = (dispatch) => ({
//   fetchTrialBalanceSheet: (query = {}) => dispatch(fetchTrialBalanceSheet({ query })),
// });

// export default connect(mapStateToProps, mapDispatchToProps);