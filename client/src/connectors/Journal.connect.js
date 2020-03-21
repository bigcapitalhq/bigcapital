import {connect} from 'react-redux';
import {
  fetchJournalSheet
} from 'store/financialStatement/financialStatements.actions';
import {
  getFinancialSheetIndexByQuery,
  getFinancialSheet,
} from 'store/financialStatement/financialStatements.selectors';

export const mapStateToProps = (state, props) => ({
  getJournalSheetIndex: (query) => getFinancialSheetIndexByQuery(state.financialStatements.journalSheets, query),
  getJournalSheet: (index) => getFinancialSheet(state.financialStatements.journalSheets, index),
});

export const mapDispatchToProps = (dispatch) => ({
  fetchJournalSheet: (query) => dispatch(fetchJournalSheet({ query })),
});

export default connect(mapStateToProps, mapDispatchToProps);