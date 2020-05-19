import { connect } from 'react-redux';
import {
  fetchItemCategories,
  submitItemCategory,
  deleteItemCategory,
  editItemCategory,
  deleteBulkItemCategories
 
} from 'store/itemCategories/itemsCategory.actions';

export const mapDispatchToProps = (dispatch) => ({
  requestSubmitItemCategory: (form) => dispatch(submitItemCategory({ form })),
  requestFetchItemCategories: (query) => dispatch(fetchItemCategories({ query })),
  requestDeleteItemCategory: (id) => dispatch(deleteItemCategory(id)),
  requestEditItemCategory: (id, form) => dispatch(editItemCategory(id, form)),
  requestDeleteBulkItemCategories:(ids)=>dispatch(deleteBulkItemCategories({ids}))
});

export default connect(null, mapDispatchToProps);