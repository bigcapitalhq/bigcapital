import { connect } from 'react-redux';
import { getItemsCategoriesListFactory } from 'store/itemCategories/ItemsCategories.selectors';
import { getResourceViews } from 'store/customViews/customViews.selectors';

export default (mapState) => {
  const getItemsCategoriesList = getItemsCategoriesListFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      categoriesList: getItemsCategoriesList(state, props),
      itemCategoriesViews: getResourceViews(state, props, 'items_categories'),
      categoriesTableLoading: state.itemCategories.loading,
      itemCategoriesSelectedRows: state.itemCategories.selectedRows,
    };
    return mapState ? mapState(mapped, state, props) : mapState;
  };

  return connect(mapStateToProps);
};
