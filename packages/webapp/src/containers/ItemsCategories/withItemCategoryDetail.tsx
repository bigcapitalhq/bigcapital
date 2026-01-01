// @ts-nocheck
import { connect } from 'react-redux';
import { getItemCategoryByIdFactory } from '@/store/itemCategories/ItemsCategories.selectors';

export const withItemCategoryDetail = () => {
  const getCategoryId = getItemCategoryByIdFactory();

  const mapStateToProps = (state, props) => {
    return {
      itemCategoryDetail: getCategoryId(state, props),
    };
  };
  return connect(mapStateToProps);
};
