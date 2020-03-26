

import {connect} from 'react-redux';
import {
  fetchItems,
  fetchItem,
  deleteItem,
  submitItem,
} from 'store/items/items.actions';
import {
  getResourceViews,
  getViewPages,
} from 'store/customViews/customViews.selectors'
import {
  getCurrentPageResults
} from 'store/selectors';
import t from 'store/types';

export const mapStateToProps = (state, props) => {
  const viewPages = getViewPages(state.items.views, state.items.currentViewId);

  return {
    views: getResourceViews(state, 'items'),
    currentPageItems: getCurrentPageResults(
      state.items.items, viewPages, state.items.currentPage),

    bulkSelected: state.items.bulkActions,
  };
};

export const mapDispatchToProps = (dispatch) => ({
  fetchItems: (query) => dispatch(fetchItems({ query })),
  requestDeleteItem: (id) => dispatch(deleteItem({ id })),
  requestSubmitItem: (form) => dispatch(submitItem({ form })),
  addBulkActionItem: (id) => dispatch({
    type: t.ITEM_BULK_ACTION_ADD, itemId: id
  }),
  removeBulkActionItem: (id) => dispatch({
    type: t.ITEM_BULK_ACTION_REMOVE, itemId: id,
  }),
});

export default connect(mapStateToProps, mapDispatchToProps);
