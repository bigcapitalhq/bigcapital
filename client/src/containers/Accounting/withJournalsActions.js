import {connect} from 'react-redux';
import {
  makeJournalEntries,
  fetchManualJournal,
  editManualJournal,
} from 'store/manualJournals/manualJournals.actions';

export const mapDispatchToProps = (dispatch) => ({
  requestMakeJournalEntries: (form) => dispatch(makeJournalEntries({ form })),
  requestFetchManualJournal: (id) => dispatch(fetchManualJournal({ id })),
  requestEditManualJournal: (id, form) => dispatch(editManualJournal({ id, form }))
});

export default connect(null, mapDispatchToProps);