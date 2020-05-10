import { connect } from 'react-redux';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const mapped = {
      categoriesList: Object.values(state.itemCategories.categories),
      categoriesTableLoading: state.itemCategories.loading,
    };
    return mapState ? mapState(mapped, state, props) : mapState;
  };
  
  return connect(mapStateToProps);
};