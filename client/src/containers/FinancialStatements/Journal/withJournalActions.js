import {connect} from 'react-redux';
import {
  fetchJournalSheet
} from 'store/financialStatement/financialStatements.actions';

export const mapDispatchToProps = (dispatch) => ({
  requestFetchJournalSheet: (query) => dispatch(fetchJournalSheet({ query })),
});

export default connect(null, mapDispatchToProps);