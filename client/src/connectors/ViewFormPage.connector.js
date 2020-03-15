import {connect} from 'react-redux';
import {
  fetchResourceColumns,
  fetchResourceFields,
} from 'store/resources/resources.actions';
import {
  getResourceColumns,
  getResourceFields,
} from 'store/resources/resources.reducer';
import {
  fetchView,
  submitView,
  editView,
} from 'store/customViews/customViews.actions';
import t from 'store/types';

export const mapStateToProps = (state, props) => {
  return {
    getResourceColumns: (resourceSlug) => getResourceColumns(state, resourceSlug),
    getResourceFields: (resourceSlug) => getResourceFields(state, resourceSlug),
  };
};

export const mapDispatchToProps = (dispatch) => ({
  changePageTitle: pageTitle => dispatch({
    type: t.CHANGE_DASHBOARD_PAGE_TITLE,
    pageTitle,
  }),
  fetchResourceFields: (resourceSlug) => dispatch(fetchResourceFields({ resourceSlug })),
  fetchResourceColumns: (resourceSlug) => dispatch(fetchResourceColumns({ resourceSlug })),
  fetchView: (id) => dispatch(fetchView({ id })),
  submitView: (form) => dispatch(submitView({ form })),
  editView: (id, form) => dispatch(editView({ id, form })),
});

export default connect(mapStateToProps, mapDispatchToProps);