import { connect } from 'react-redux';
import {
  getCategoryId,
} from 'store/itemCategories/itemsCategory.reducer';

export const mapStateToProps = (state, props) => {
  return {
    itemCategory: getCategoryId(state, props.itemCategoryId),
  };
};

export default connect(mapStateToProps);
