import { connect } from 'react-redux';
import t from 'store/types';
import { generalSearch } from 'store/search/search.actions';

export const mapStateToProps = (state, props) => ({
  resultSearch: state.GeneralSearch,
});

export const mapDispatchToProps = (dispatch) => ({
  generalSearch: (result) => dispatch(generalSearch(result)),
});

export default connect(mapStateToProps, mapDispatchToProps);
