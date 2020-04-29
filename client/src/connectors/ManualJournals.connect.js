import { connect } from 'react-redux';
import {
  deleteManualJournal,
  fetchManualJournalsTable,
  publishManualJournal,
  deleteBulkManualJournals,
} from 'store/manualJournals/manualJournals.actions';
import { getResourceViews } from 'store/customViews/customViews.selectors';
import t from 'store/types';
import {
  getManualJournalsItems,
} from 'store/manualJournals/manualJournals.selectors'

const mapStateToProps = (state, props) => ({
  views: getResourceViews(state, 'manual_journals'),
  manualJournals: getManualJournalsItems(state, state.manualJournals.currentViewId),
  tableQuery: state.manualJournals.tableQuery,
  manualJournalsLoading: state.manualJournals.loading,
});

const mapActionsToProps = (dispatch) => ({
  requestDeleteManualJournal: (id) => dispatch(deleteManualJournal({ id })),
  changeCurrentView: (id) =>
    dispatch({
      type: t.MANUAL_JOURNALS_SET_CURRENT_VIEW,
      currentViewId: parseInt(id, 10),
    }),
  addManualJournalsTableQueries: (queries) =>
    dispatch({
      type: t.MANUAL_JOURNALS_TABLE_QUERIES_ADD,
      queries,
    }),
  fetchManualJournalsTable: (query = {}) =>
    dispatch(fetchManualJournalsTable({ query: { ...query } })),

  requestPublishManualJournal: (id) => dispatch(publishManualJournal({ id })),
  requestDeleteBulkManualJournals: (ids) => dispatch(deleteBulkManualJournals({ ids })),
});

export default connect(mapStateToProps, mapActionsToProps);
