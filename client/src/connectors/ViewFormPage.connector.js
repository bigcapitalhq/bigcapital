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
    
  };
};

export const mapDispatchToProps = (dispatch) => ({
  fetchView: (id) => dispatch(fetchView({ id })),
  submitView: (form) => dispatch(submitView({ form })),
  editView: (id, form) => dispatch(editView({ id, form })),
});

export default connect(mapStateToProps, mapDispatchToProps);