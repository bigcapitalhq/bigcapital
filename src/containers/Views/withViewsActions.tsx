// @ts-nocheck
import {connect} from 'react-redux';
import {
  fetchView,
  submitView,
  deleteView,
  editView,
  fetchViewResource,
  fetchResourceViews,
} from '@/store/customViews/customViews.actions';


export const mapDispatchToProps = (dispatch) => ({
  requestFetchView: (id) => dispatch(fetchView({ id })),
  requestSubmitView: (form) => dispatch(submitView({ form })),
  requestEditView: (id, form) => dispatch(editView({ id, form })),
  requestDeleteView: (id) => dispatch(deleteView({ id })),

  requestFetchResourceViews: (resourceSlug) => dispatch(fetchResourceViews({ resourceSlug })),
  requestFetchViewResource: (id) => dispatch(fetchViewResource({ id })),
});

export default connect(null, mapDispatchToProps);