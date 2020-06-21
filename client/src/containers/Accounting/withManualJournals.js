import { connect } from 'react-redux';
import { pick, mapValues } from 'lodash';
import { getResourceViews } from 'store/customViews/customViews.selectors';
import { getManualJournalsItems } from 'store/manualJournals/manualJournals.selectors';

const queryParamsKeys = ['page_size', 'page'];

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const queryParams = props.location
      ? new URLSearchParams(props.location.search)
      : null;

    const manualJournalsTableQuery = {
      ...state.manualJournals.tableQuery,
      ...(queryParams
        ? mapValues(
            pick(Object.fromEntries(queryParams), queryParamsKeys),
            (v) => parseInt(v, 10),
          )
        : {}),
    };

    const mapped = {
      manualJournalsCurrentPage: getManualJournalsItems(
        state,
        state.manualJournals.currentViewId,
        manualJournalsTableQuery.page,
      ),
      manualJournalsTableQuery,
      manualJournalsViews: getResourceViews(state, 'manual_journals'),
      manualJournalsItems: state.manualJournals.items,

      manualJournalsPagination: state.manualJournals.paginationMeta,
      manualJournalsLoading: state.manualJournals.loading,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };

  return connect(mapStateToProps);
};
