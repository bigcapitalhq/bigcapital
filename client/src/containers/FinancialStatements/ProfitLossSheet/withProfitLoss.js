import {connect} from 'react-redux';
import {
  getFinancialSheetFactory,
  getFinancialSheetColumnsFactory,
  getFinancialSheetQueryFactory,
  getFinancialSheetTableRowsFactory,
} from 'store/financialStatement/financialStatements.selectors';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const getProfitLossSheet = getFinancialSheetFactory('profitLoss');
    const getProfitLossColumns = getFinancialSheetColumnsFactory('profitLoss');
    const getProfitLossQuery = getFinancialSheetQueryFactory('profitLoss');
    const getProfitLossTableRows = getFinancialSheetTableRowsFactory('profitLoss');

    const mapped = {
      profitLossSheet: getProfitLossSheet(state, props),
      profitLossColumns: getProfitLossColumns(state, props),
      profitLossQuery: getProfitLossQuery(state, props),
      profitLossTableRows: getProfitLossTableRows(state, props),

      profitLossSheetLoading: state.financialStatements.profitLoss.loading,
      profitLossSheetFilter: state.financialStatements.profitLoss.filter,
      profitLossSheetRefresh: state.financialStatements.profitLoss.refresh,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
}