import {connect} from 'react-redux';
import {
  getResourceViews,
  getViewPages,
} from 'store/customViews/customViews.selectors'
import {
  getCurrentPageResults
} from 'store/selectors';

export const mapStateToProps = (state, props) => {
  const viewPages = getViewPages(state.items.views, state.items.currentViewId);

  return {
    itemsViews: getResourceViews(state, 'items'),
    itemsCurrentPage: getCurrentPageResults(
      state.items.items,
      viewPages,
      state.items.currentPage,
    ),
    itemsBulkSelected: state.items.bulkActions,
    itemsTableLoading: state.items.loading,
    itemsTableQuery: state.items.tableQuery,
  };
};

export default connect(mapStateToProps);
