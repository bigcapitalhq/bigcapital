import { getFinancialSheetIndexByQuery } from 'store/financialStatement/financialStatements.selectors';
import { connect } from 'react-redux';

const mapStateToProps = (state, props) => {
  const { receivableAgingSummaryQuery } = props;

  return {
    receivableAgingSummaryIndex: getFinancialSheetIndexByQuery(
      state.financialStatements.receivableAgingSummary.sheets,
      receivableAgingSummaryQuery,
    ),
  };
}
export default connect(mapStateToProps);