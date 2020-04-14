import { connect } from 'react-redux';
import t from 'store/types';
import { generalSearch } from 'store/search/search.actions';

export const mapStateToProps = (state, props) => ({
  resultSearch: state.globalSearch.searches,
  globalSearchShow: state.globalSearch.isOpen,
});

export const mapDispatchToProps = (dispatch) => ({
  openGlobalSearch: (result) => dispatch({ type: t.OPEN_SEARCH, }),
  closeGlobalSearch: (result) => dispatch({ type: t.CLOSE_SEARCH }),
});

export default connect(mapStateToProps, mapDispatchToProps);
