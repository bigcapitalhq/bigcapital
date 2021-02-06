import { connect } from 'react-redux';
import {
  getFinancialSheetFactory,
  getFinancialSheetColumnsFactory,
  getFinancialSheetTableRowsFactory,
} from 'store/financialStatement/financialStatements.selectors';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const getAPAgingSheet = getFinancialSheetFactory('payableAgingSummary');
    const getAPAgingSheetColumns = getFinancialSheetColumnsFactory(
      'payableAgingSummary',
    );
    const getAPAgingSheetRows = getFinancialSheetTableRowsFactory(
      'payableAgingSummary',
    );

    const {
      loading,
      filter,
      refresh,
    } = state.financialStatements.payableAgingSummary;

    const mapped = {
      payableAgingSummarySheet: getAPAgingSheet(state, props),
      payableAgingSummaryColumns: getAPAgingSheetColumns(state, props),
      payableAgingSummaryRows: getAPAgingSheetRows(state, props),
      payableAgingSummaryLoading: loading,
      payableAgingSummaryFilter: filter,
      APAgingSummaryRefresh: refresh,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
