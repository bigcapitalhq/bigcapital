import { connect } from 'react-redux';


export const mapStateToProps = (state, props) => {
  return {
    categoriesList: Object.values(state.itemCategories.categories),
    categoriesTableLoading: state.itemCategories.loading,
  };
};

export default connect(mapStateToProps);
