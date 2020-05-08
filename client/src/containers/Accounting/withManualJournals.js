import { connect } from 'react-redux';
import { getResourceViews } from 'store/customViews/customViews.selectors';
import {
  getManualJournalsItems,
} from 'store/manualJournals/manualJournals.selectors'


const mapStateToProps = (state, props) => ({
  manualJournals: getManualJournalsItems(state, state.manualJournals.currentViewId),
  manualJournalsViews: getResourceViews(state, 'manual_journals'),
  manualJournalsItems: state.manualJournals.items,
  manualJournalsTableQuery: state.manualJournals.tableQuery,
  manualJournalsLoading: state.manualJournals.loading,
});

export default connect(mapStateToProps);
