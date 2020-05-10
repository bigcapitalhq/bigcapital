import {connect} from 'react-redux';
import {
  getFinancialSheetIndexByQuery,
  getFinancialSheet,
  getFinancialSheetTableRows,
} from 'store/financialStatement/financialStatements.selectors';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const { journalIndex } = props;

    const mapped = {
      journalSheet: getFinancialSheet(state.financialStatements.journal.sheets, journalIndex),
      journalSheetTableRows: getFinancialSheetTableRows(state.financialStatements.journal.sheets, journalIndex),
      journalSheetLoading: state.financialStatements.journal.loading,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };

  return connect(mapStateToProps);
};
