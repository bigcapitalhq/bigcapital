import {connect} from 'react-redux';
import {
  getFinancialSheetAccounts,
  getFinancialSheetQuery,
} from 'store/financialStatement/financialStatements.selectors';


export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const { trialBalanceIndex } = props;
    const mapped = {
      trialBalanceAccounts: getFinancialSheetAccounts(state.financialStatements.trialBalance.sheets, trialBalanceIndex),
      trialBalanceQuery: getFinancialSheetQuery(state.financialStatements.trialBalance.sheets, trialBalanceIndex),

      trialBalanceSheetLoading: state.financialStatements.trialBalance.loading,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };

  return connect(mapStateToProps);
};
