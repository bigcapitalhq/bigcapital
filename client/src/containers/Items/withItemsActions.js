import { connect } from 'react-redux';
import {
  fetchItems,
  fetchItem,
  deleteItem,
  submitItem,
  editItem,
  deleteBulkItems,
} from 'store/items/items.actions';
import t from 'store/types';

export const mapDispatchToProps = (dispatch) => ({
  requestFetchItems: (query) => dispatch(fetchItems({ query })),
  requestFetchItem: (id) => dispatch(fetchItem({ id })),
  requestDeleteItem: (id) => dispatch(deleteItem({ id })),
  requestDeleteBulkItems: (ids) => dispatch(deleteBulkItems({ ids })),
  requestSubmitItem: (form) => dispatch(submitItem({ form })),
  requestEditItem: (id, form) => dispatch(editItem({ id, form })),
  addBulkActionItem: (id) =>
    dispatch({
      type: t.ITEM_BULK_ACTION_ADD,
      itemId: id,
    }),
  removeBulkActionItem: (id) =>
    dispatch({
      type: t.ITEM_BULK_ACTION_REMOVE,
      itemId: id,
    }),
  setItemsTableQuery: (key, value) =>
    dispatch({
      type: t.ITEMS_TABLE_QUERY_SET,
      key,
      value,
    }),
  addItemsTableQueries: (queries) =>
    dispatch({
      type: t.ITEMS_TABLE_QUERIES_ADD,
      payload: { queries },
    }),

  changeItemsCurrentView: (id) =>
    dispatch({
      type: t.ITEMS_SET_CURRENT_VIEW,
      currentViewId: parseInt(id, 10),
    }),
});

export default connect(null, mapDispatchToProps);
