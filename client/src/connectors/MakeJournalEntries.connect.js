import {connect} from 'react-redux';
import {
  makeJournalEntries,
  fetchManualJournal,
  editManualJournal,
} from 'store/manualJournals/manualJournals.actions';
import {
  getManualJournal,
} from 'store/manualJournals/manualJournals.reducers';

export const mapStateToProps = (state, props) => ({
  getManualJournal: (id) => getManualJournal(state, id),
});

export const mapDispatchToProps = (dispatch) => ({
  requestMakeJournalEntries: (form) => dispatch(makeJournalEntries({ form })),
  fetchManualJournal: (id) => dispatch(fetchManualJournal({ id })),
  requestEditManualJournal: (id, form) => dispatch(editManualJournal({ id, form }))
});

export default connect(mapStateToProps, mapDispatchToProps);