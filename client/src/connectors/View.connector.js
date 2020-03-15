import {connect} from 'react-redux';
import {
  fetchView,
  submitView,
  deleteView,
  editView,
} from 'store/customViews/customViews.actions';
import {
  getViewMeta,
  getViewItem,
} from 'store/customViews/customViews.selectors';

export const mapStateToProps = (state) => ({
  getViewMeta: (viewId) => getViewMeta(state, viewId),
  getViewItem: (viewId) => getViewItem(state, viewId),
});

export const mapDispatchToProps = (dispatch) => ({
  fetchView: (id) => dispatch(fetchView({ id })),
  submitView: (form) => dispatch(submitView({ form })),
  editView: (id, form) => dispatch(editView({ id, form })),
  deleteView: (id) => dispatch(deleteView({ id })),
});

export default connect(mapStateToProps, mapDispatchToProps);