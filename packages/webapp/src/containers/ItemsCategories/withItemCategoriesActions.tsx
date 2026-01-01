// @ts-nocheck
import { connect } from 'react-redux';
import { setItemsCategoriesTableState } from '@/store/itemCategories/itemsCategory.actions';

export const mapDispatchToProps = (dispatch) => ({
  setItemsCategoriesTableState: (state) =>
    dispatch(setItemsCategoriesTableState(state)),
});

export const withItemCategoriesActions = connect(null, mapDispatchToProps);
