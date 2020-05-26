import { connect } from 'react-redux';
import { getManualJournal } from 'store/manualJournals/manualJournals.reducers';

const mapStateToProps = (state, props) => ({
  manualJournal: getManualJournal(state, props.manualJournalId),
});

export default connect(mapStateToProps);
