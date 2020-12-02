import { connect } from 'react-redux';
import { getManualJournalByIdFactory } from 'store/manualJournals/manualJournals.selectors';

export default () => {
  const getManualJournalById = getManualJournalByIdFactory();

  const mapStateToProps = (state, props) => ({
    manualJournal: getManualJournalById(state, props),
  });
  return connect(mapStateToProps);
};