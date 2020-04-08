import { connect } from 'react-redux';
import {
  deleteManualJournal,
  // fetchManualJournalsList,
  fetchManualJournalsTable,
} from 'store/accounting/accounting.actions';
import { getResourceViews } from 'store/customViews/customViews.selectors';
import { getManualJournals } from 'store/accounting/accounting.selectors';
import t from 'store/types';

const mapStateToProps = (state, props) => ({
  views: getResourceViews(state, 'manual_journals'),
  // manual_journals: state.manual_journals,
  manual_journals: getManualJournals(
    state,
    state.manual_journals.currentViewId
  ),
  tableQuery: state.manual_journals.tableQuery,
  manualJournalsLoading: state.manual_journals.loading,
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
      type: 'MANUAL_JOURNALS_TABLE_QUERIES_ADD',
      queries,
    }),
  fetchManualJournalsTable: (query = {}) =>
    dispatch(fetchManualJournalsTable({ query: { ...query } })),
});

export default connect(mapStateToProps, mapActionsToProps);
