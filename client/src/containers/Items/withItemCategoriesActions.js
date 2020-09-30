import { connect } from 'react-redux';
import {
  fetchItemCategories,
  submitItemCategory,
  deleteItemCategory,
  editItemCategory,
  deleteBulkItemCategories,
} from 'store/itemCategories/itemsCategory.actions';
import t from 'store/types';

export const mapDispatchToProps = (dispatch) => ({
  requestSubmitItemCategory: (form) => dispatch(submitItemCategory({ form })),
  requestFetchItemCategories: (query) =>
    dispatch(fetchItemCategories({ query })),
  requestDeleteItemCategory: (id) => dispatch(deleteItemCategory(id)),
  requestEditItemCategory: (id, form) => dispatch(editItemCategory(id, form)),
  requestDeleteBulkItemCategories: (ids) =>
    dispatch(deleteBulkItemCategories({ ids })),

  changeItemCategoriesView: (id) =>
    dispatch({
      type: t.ITEM_CATEGORIES_SET_CURRENT_VIEW,
      currentViewId: parseInt(id, 10),
    }),

  addItemCategoriesTableQueries: (queries) =>
    dispatch({
      type: t.ITEM_CATEGORIES_TABLE_QUERIES_ADD,
      queries,
    }),
});

export default connect(null, mapDispatchToProps);
