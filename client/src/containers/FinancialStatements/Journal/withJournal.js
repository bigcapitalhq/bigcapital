import { connect } from 'react-redux';
import {
  getFinancialSheetFactory,
  getFinancialSheetTableRowsFactory,
  getFinancialSheetQueryFactory,
} from 'store/financialStatement/financialStatements.selectors';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const getJournalSheet = getFinancialSheetFactory('journal');
    const getJournalSheetTableRows = getFinancialSheetTableRowsFactory(
      'journal',
    );
    const getJournalSheetQuery = getFinancialSheetQueryFactory('journal');

    const mapped = {
      journalSheet: getJournalSheet(state, props),
      journalSheetTableRows: getJournalSheetTableRows(state, props),
      journalSheetQuery: getJournalSheetQuery(state, props),
      journalSheetLoading: state.financialStatements.journal.loading,
      journalSheetFilter: state.financialStatements.journal.filter,
      journalSheetRefresh: state.financialStatements.journal.refresh,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
