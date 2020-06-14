import { connect } from 'react-redux';
import {
  getFinancialSheet,
  getFinancialSheetColumns,
} from 'store/financialStatement/financialStatements.selectors';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const { receivableAgingSummaryIndex } = props;

    const mapped = {
      receivableAgingSummarySheet: getFinancialSheet(
        state.financialStatements.receivableAgingSummary.sheets,
        receivableAgingSummaryIndex,
      ),
      receivableAgingSummaryColumns: getFinancialSheetColumns(
        state.financialStatements.receivableAgingSummary.sheets,
        receivableAgingSummaryIndex,
      ),
      receivableAgingSummaryLoading:
        state.financialStatements.receivableAgingSummary.loading,
      receivableAgingSummaryFilter: 
        state.financialStatements.receivableAgingSummary.filter,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
}