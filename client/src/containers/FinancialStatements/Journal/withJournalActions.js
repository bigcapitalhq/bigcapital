import {connect} from 'react-redux';
import {
  fetchJournalSheet,
  refreshJournalSheet,
} from 'store/financialStatement/financialStatements.actions';

export const mapDispatchToProps = (dispatch) => ({
  requestFetchJournalSheet: (query) => dispatch(fetchJournalSheet({ query })),
  toggleJournalSheetFilter: () => dispatch({ type: 'JOURNAL_FILTER_TOGGLE' }),
  refreshJournalSheet: (refresh) => dispatch(refreshJournalSheet(refresh)),
});

export default connect(null, mapDispatchToProps);