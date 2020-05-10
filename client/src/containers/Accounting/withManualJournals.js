import { connect } from 'react-redux';
import { getResourceViews } from 'store/customViews/customViews.selectors';
import {
  getManualJournalsItems,
} from 'store/manualJournals/manualJournals.selectors'

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const mapped = {
      manualJournals: getManualJournalsItems(state, state.manualJournals.currentViewId),
      manualJournalsViews: getResourceViews(state, 'manual_journals'),
      manualJournalsItems: state.manualJournals.items,
      manualJournalsTableQuery: state.manualJournals.tableQuery,
      manualJournalsLoading: state.manualJournals.loading,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  
  return connect(mapStateToProps);
};
