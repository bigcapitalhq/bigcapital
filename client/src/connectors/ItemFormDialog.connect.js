//FIXME: FIX Later Need More Work

import { connect } from 'react-redux';
import {
  submitItemCategory,
  submitCategory,
  fetchCategory
} from 'store/itemCategories/itemsCategory.actions';

export const mapStateToProps = (state, props) => {
  return {
    category: state.category,
    name: 'item-form',
    payload: { action: 'new', id: null }
  };
};

export const mapDispatchToProps = dispatch => ({
  submitItemCategory: form => dispatch(submitItemCategory({ form })),
  submitCategory: form => dispatch(submitCategory({ form })),
  fetchCategory: () => dispatch(fetchCategory())
});

export default connect(mapStateToProps, mapDispatchToProps);
