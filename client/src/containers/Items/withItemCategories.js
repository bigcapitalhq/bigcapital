import { connect } from 'react-redux';
import {
  getItemsCategoriesListFactory
} from 'store/itemCategories/ItemsCategories.selectors';


export default (mapState) => {
  const getItemsCategoriesList = getItemsCategoriesListFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      categoriesList: getItemsCategoriesList(state, props),
      categoriesTableLoading: state.itemCategories.loading,
    };
    return mapState ? mapState(mapped, state, props) : mapState;
  };
  
  return connect(mapStateToProps);
};