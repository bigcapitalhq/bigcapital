import { connect } from 'react-redux';
import { getResourceViews } from 'store/customViews/customViews.selectors';
import {
  getManualJournalsItems,
  getManualJournalsPagination,
  getManualJournalsTableQuery,
} from 'store/manualJournals/manualJournals.selectors';


export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const query = getManualJournalsTableQuery(state, props);

    const mapped = {
      manualJournalsCurrentPage: getManualJournalsItems(state, props, query),
      manualJournalsTableQuery: query,
      manualJournalsViews: getResourceViews(state, props, 'manual_journals'),
      manualJournalsItems: state.manualJournals.items,

      manualJournalsPagination: getManualJournalsPagination(state, props, query),
      manualJournalsLoading: state.manualJournals.loading,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };

  return connect(mapStateToProps);
};
