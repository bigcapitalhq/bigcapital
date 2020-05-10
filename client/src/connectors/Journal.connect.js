import {connect} from 'react-redux';
import {
  fetchJournalSheet
} from 'store/financialStatement/financialStatements.actions';
import {
  getFinancialSheetIndexByQuery,
  getFinancialSheet,
} from 'store/financialStatement/financialStatements.selectors';


export const mapStateToProps = (state, props) => ({
  getJournalSheetIndex: (query) => getFinancialSheetIndexByQuery(state.financialStatements.journal.sheets, query),
  getJournalSheet: (index) => getFinancialSheet(state.financialStatements.journal.sheets, index),
  journalSheetLoading: state.financialStatements.journal.loading,
});

export const mapDispatchToProps = (dispatch) => ({
  fetchJournalSheet: (query) => dispatch(fetchJournalSheet({ query })),
});

export default connect(mapStateToProps, mapDispatchToProps);