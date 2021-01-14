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
    const getARAgingSheet = getFinancialSheetFactory('receivableAgingSummary');
    const getARAgingSheetColumns = getFinancialSheetColumnsFactory(
      'receivableAgingSummary',
    );
    const getARAgingSheetRows = getFinancialSheetTableRowsFactory(
      'receivableAgingSummary',
    );
    const {
      loading,
      filter,
      refresh,
    } = state.financialStatements.receivableAgingSummary;

    const mapped = {
      receivableAgingSummarySheet: getARAgingSheet(state, props),
      receivableAgingSummaryColumns: getARAgingSheetColumns(state, props),
      receivableAgingSummaryRows: getARAgingSheetRows(state, props),
      receivableAgingSummaryLoading: loading,
      receivableAgingSummaryFilter: filter,
      ARAgingSummaryRefresh: refresh,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
