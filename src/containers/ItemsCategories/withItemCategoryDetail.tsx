// @ts-nocheck
import { connect } from 'react-redux';
import { getItemCategoryByIdFactory } from '@/store/itemCategories/ItemsCategories.selectors';

export default () => {
  const getCategoryId = getItemCategoryByIdFactory();

  const mapStateToProps = (state, props) => {
    return {
      itemCategoryDetail: getCategoryId(state, props),
    };
  };
  return connect(mapStateToProps);
};
