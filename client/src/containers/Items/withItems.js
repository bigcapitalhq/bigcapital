import {connect} from 'react-redux';
import {
  getResourceViews,
} from 'store/customViews/customViews.selectors'
import {
  getItemsCurrentPageFactory,
  getItemsPaginationMetaFactory,
  getItemsTableQueryFactory,
  getItemsCurrentViewIdFactory
} from 'store/items/items.selectors';

export default (mapState) => {
  const getItemsCurrentPage = getItemsCurrentPageFactory();
  const getItemsPaginationMeta = getItemsPaginationMetaFactory();
  const getItemsTableQuery = getItemsTableQueryFactory();
  const getItemsCurrentViewId = getItemsCurrentViewIdFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      itemsViews: getResourceViews(state, props, 'items'),
      itemsCurrentPage: getItemsCurrentPage(state, props),
      itemsBulkSelected: state.items.bulkActions,
      itemsTableLoading: state.items.loading,
      itemsSelectedRows: state.items.selectedRows,
      itemsTableQuery: getItemsTableQuery(state, props),
      itemsPagination: getItemsPaginationMeta(state, props),
      itemsCurrentViewId: getItemsCurrentViewId(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };

  return connect(mapStateToProps);
};