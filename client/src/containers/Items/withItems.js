import {connect} from 'react-redux';
import {
  getResourceViews,
  getViewPages,
} from 'store/customViews/customViews.selectors'
import {
  getCurrentPageResults
} from 'store/selectors';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const viewPages = getViewPages(state.items.views, state.items.currentViewId);
    const mapped = {
      itemsViews: getResourceViews(state, props, 'items'),
      itemsCurrentPage: getCurrentPageResults(
        state.items.items,
        viewPages,
        state.items.currentPage,
      ),
      itemsBulkSelected: state.items.bulkActions,
      itemsTableLoading: state.items.loading,
      itemsTableQuery: state.items.tableQuery,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };

  return connect(mapStateToProps);
};