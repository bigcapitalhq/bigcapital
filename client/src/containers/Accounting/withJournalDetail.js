import {connect} from 'react-redux';
import {
  getManualJournal,
} from 'store/manualJournals/manualJournals.reducers';

export const mapStateToProps = (state, props) => ({
  manualJournal: getManualJournal(state, props.manualJournalId),
});

export default connect(mapStateToProps);