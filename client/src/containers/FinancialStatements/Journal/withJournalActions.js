import {connect} from 'react-redux';
import {
  fetchJournalSheet
} from 'store/financialStatement/financialStatements.actions';

export const mapDispatchToProps = (dispatch) => ({
  requestFetchJournalSheet: (query) => dispatch(fetchJournalSheet({ query })),
  toggleJournalSheetFilter: () => dispatch({ type: 'JOURNAL_FILTER_TOGGLE' }),
});

export default connect(null, mapDispatchToProps);