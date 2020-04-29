import { connect } from 'react-redux';
import {
  fetchItemCategories,
  submitItemCategory,
  deleteItemCategory,
  editItemCategory,
} from 'store/itemCategories/itemsCategory.actions';
import { getDialogPayload } from 'store/dashboard/dashboard.reducer';
import { getCategoryId } from 'store/itemCategories/itemsCategory.reducer';

export const mapStateToProps = (state, props) => {
  const dialogPayload = getDialogPayload(state, 'item-form');

  return {
    categories: Object.values(state.itemCategories.categories),
    name: 'item-form',
    payload: { action: 'new', id: null },
    editItemCategory:
      dialogPayload && dialogPayload.action === 'edit'
        ? state.itemCategories.categories[dialogPayload.id]
        : {},
    getCategoryId: (id) => getCategoryId(state, id),
  };
};
export const mapDispatchToProps = (dispatch) => ({
  requestSubmitItemCategory: (form) => dispatch(submitItemCategory({ form })),
  requestFetchItemCategories: () => dispatch(fetchItemCategories()),
  requestDeleteItemCategory: (id) => dispatch(deleteItemCategory(id)),
  requestEditItemCategory: (id, form) => dispatch(editItemCategory(id, form)),
});

export default connect(mapStateToProps, mapDispatchToProps);
